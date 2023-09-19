import type { SimpleGit } from 'simple-git';

import type { BettererFileCache, BettererFilePaths, BettererVersionControl } from './types.js';

import { BettererError } from '@betterer/errors';
import assert from 'node:assert';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { simpleGit } from 'simple-git';

import { createHash } from '../hasher.js';
import { normalisedPath } from '../utils.js';
import { BettererFileCacheΩ } from './file-cache.js';
import { read } from './reader.js';

export class BettererGitΩ implements BettererVersionControl {
  private _cache: BettererFileCache | null = null;
  private _configPaths: BettererFilePaths = [];
  private _fileMap: Record<string, string> = {};
  private _filePaths: Array<string> = [];
  private _git: SimpleGit | null = null;
  private _gitDir: string | null = null;
  private _rootDir: string | null = null;
  private _syncing: Promise<void> | null = null;

  public async add(resultsPath: string): Promise<void> {
    assert(this._git);
    await this._git.add(resultsPath);
  }

  public filterCached(testName: string, filePaths: BettererFilePaths): BettererFilePaths {
    assert(this._cache);
    return this._cache.filterCached(testName, filePaths);
  }

  public filterIgnored(filePaths: BettererFilePaths): BettererFilePaths {
    return filePaths.filter((absolutePath) => this._fileMap[absolutePath]);
  }

  public clearCache(testName: string): void {
    assert(this._cache);
    this._cache.clearCache(testName);
  }

  public async enableCache(cachePath: string): Promise<void> {
    assert(this._cache);
    return await this._cache.enableCache(cachePath);
  }

  public updateCache(testName: string, filePaths: BettererFilePaths): void {
    assert(this._cache);
    return this._cache.updateCache(testName, filePaths);
  }

  public writeCache(): Promise<void> {
    assert(this._cache);
    return this._cache.writeCache();
  }

  public getFilePaths(): BettererFilePaths {
    return this._filePaths;
  }

  public async init(configPaths: BettererFilePaths, cwd: string): Promise<string> {
    this._configPaths = configPaths;
    this._gitDir = await this._findGitRoot(cwd);
    this._rootDir = path.dirname(this._gitDir);
    this._git = simpleGit(this._rootDir);
    this._cache = new BettererFileCacheΩ(this._configPaths);
    await this._init(this._git);
    await this.sync();
    return this._rootDir;
  }

  public async sync(): Promise<void> {
    if (this._syncing) {
      return await this._syncing;
    }
    this._syncing = this._sync();
    await this._syncing;
    this._syncing = null;
  }

  private async _findGitRoot(cwd: string): Promise<string> {
    let dir = cwd;
    while (dir !== path.parse(dir).root) {
      try {
        const gitPath = path.join(dir, '.git');
        await fs.access(gitPath);
        return gitPath;
      } catch (err) {
        dir = path.join(dir, '..');
      }
    }
    throw new BettererError('.git directory not found. Betterer must be used within a git repository.');
  }

  private async _getFileHash(filePath: string): Promise<string | null> {
    const content = await read(filePath);
    if (content == null) {
      return null;
    }

    return createHash(content);
  }

  private async _init(git: SimpleGit): Promise<void> {
    const retries = 3;
    for (let i = 0; i < retries; i++) {
      try {
        await git.init();
      } catch (error) {
        if (i >= retries) {
          throw error;
        }
      }
    }
  }

  private _toFilePaths(rootDir: string, lines: Array<string>): Array<string> {
    return lines.map((line) => toAbsolutePath(rootDir, line));
  }

  private _toLines(output: string): Array<string> {
    if (output.length === 0) {
      return [];
    }
    return Array.from(new Set(output.trimEnd().split('\n')));
  }

  private async _sync(): Promise<void> {
    this._fileMap = {};
    this._filePaths = [];

    assert(this._cache);
    assert(this._git);
    assert(this._rootDir);
    const treeOutput = await this._git.raw(['ls-tree', '--full-tree', '-r', 'HEAD']);
    const fileInfo = this._toLines(treeOutput).map((info) => info.split(/\s/));

    const fileHashes: Record<string, string | null> = {};

    // Collect hashes from git:
    fileInfo.forEach((fileInfo) => {
      const [, , hash, relativePath] = fileInfo;
      assert(this._rootDir);
      const absolutePath = toAbsolutePath(this._rootDir, relativePath);
      fileHashes[absolutePath] = hash;
      return absolutePath;
    });

    // Collect hashes for modified files:
    const modifiedOutput = await this._git.raw(['ls-files', '--modified']);
    const modifiedFilePaths = this._toFilePaths(this._rootDir, this._toLines(modifiedOutput));
    await Promise.all(
      modifiedFilePaths.map(async (absolutePath) => {
        fileHashes[absolutePath] = await this._getFileHash(absolutePath);
      })
    );

    // Collect all tracked files, excluding files that have been deleted, *and* all untracked files:
    const allFilesOutput = await this._git.raw(['ls-files', '--cached', '--others', '--exclude-standard']);
    const allFilePaths = this._toFilePaths(this._rootDir, this._toLines(allFilesOutput));
    await Promise.all(
      allFilePaths.map(async (absolutePath) => {
        // If file is tracked:
        //    `fileHashes[absolutePath]` = the git hash.
        // If file was tracked and is now deleted:
        //    `fileHashes[absolutePath]` = null
        //    `this._getFileHash(absolutePath)` = null
        // If file is untracked and is new:
        //    `fileHashes[absolutePath]` = null
        //    `this._getFileHash(absolutePath) = basic hash
        const hash = fileHashes[absolutePath] || (await this._getFileHash(absolutePath));

        // If hash is null then the file was deleted so it shouldn't be included:
        if (hash == null) {
          return;
        }
        this._fileMap[absolutePath] = hash;
        this._filePaths.push(absolutePath);
      })
    );

    const cacheΩ = this._cache as BettererFileCacheΩ;
    cacheΩ.setHashes(this._fileMap);
  }
}

function toAbsolutePath(rootDir: string, relativePath: string): string {
  return normalisedPath(path.join(rootDir, relativePath.trimStart()));
}
