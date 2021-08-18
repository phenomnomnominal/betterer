import { BettererError } from '@betterer/errors';
import assert from 'assert';
import { promises as fs } from 'fs';
import path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

import { createHash } from '../hasher';
import { normalisedPath } from '../utils';
import { BettererFileCacheΩ } from './file-cache';
import { read } from './reader';
import { BettererFilePaths, BettererVersionControl } from './types';

export class BettererGitΩ implements BettererVersionControl {
  private _cache: BettererFileCacheΩ;
  private _fileMap: Record<string, string> = {};
  private _filePaths: Array<string> = [];
  private _git: SimpleGit | null = null;
  private _gitDir: string | null = null;
  private _rootDir: string | null = null;
  private _syncing: Promise<void> | null = null;

  constructor() {
    this._cache = new BettererFileCacheΩ();
  }

  public async add(resultsPath: string): Promise<void> {
    assert(this._git);
    await this._git.add(resultsPath);
  }

  public filterCached(filePaths: BettererFilePaths): BettererFilePaths {
    return this._cache.filterCached(filePaths);
  }

  public filterIgnored(filePaths: BettererFilePaths): BettererFilePaths {
    return filePaths.filter((absolutePath) => this._fileMap[absolutePath]);
  }

  public async enableCache(cachePath: string): Promise<void> {
    return this._cache.enableCache(cachePath);
  }

  public updateCache(filePaths: BettererFilePaths): void {
    return this._cache.updateCache(filePaths);
  }

  public writeCache(): Promise<void> {
    return this._cache.writeCache();
  }

  public getFilePaths(): BettererFilePaths {
    return this._filePaths;
  }

  public async init(): Promise<void> {
    this._gitDir = await this._findGitRoot();
    this._rootDir = path.dirname(this._gitDir);
    this._git = simpleGit(this._rootDir);
    this._cache = new BettererFileCacheΩ();
    await this._git.init();
    await this.sync();
  }

  public async sync(): Promise<void> {
    if (this._syncing) {
      return this._syncing;
    }
    this._syncing = this._sync();
    await this._syncing;
    this._syncing = null;
  }

  private async _findGitRoot(): Promise<string> {
    let dir = process.cwd();
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

  private _toFilePaths(output: string): Array<string> {
    if (output.length === 0) {
      return [];
    }
    return Array.from(new Set(output.trimEnd().split('\n')));
  }

  private async _sync(): Promise<void> {
    this._fileMap = {};
    this._filePaths = [];

    assert(this._git);
    const tree = await this._git.raw(['ls-tree', '--full-tree', '-r', 'HEAD']);
    const fileInfo = this._toFilePaths(tree).map((info) => info.split(/\s/));

    const fileHashes: Record<string, string | null> = {};

    // Collect hashes from git:
    fileInfo.forEach((fileInfo) => {
      const [, , hash, relativePath] = fileInfo;
      assert(this._rootDir);
      const absolutePath = normalisedPath(path.join(this._rootDir, relativePath.trimStart()));
      fileHashes[absolutePath] = hash;
      return absolutePath;
    });

    // Collect hashes for modified files:
    const modified = await this._git.raw(['ls-files', '--modified']);
    const modifiedFilePaths = this._toFilePaths(modified);
    await Promise.all(
      modifiedFilePaths.map(async (relativePath) => {
        assert(this._rootDir);
        const absolutePath = normalisedPath(path.join(this._rootDir, relativePath));
        fileHashes[absolutePath] = await this._getFileHash(absolutePath);
      })
    );

    // Collect all tracked files, excluding files that have been deleted, *and* all untracked files:
    const allFiles = await this._git.raw(['ls-files', '--cached', '--others', '--exclude-standard']);
    const allFilePaths = this._toFilePaths(allFiles);
    await Promise.all(
      allFilePaths.map(async (relativePath) => {
        assert(this._rootDir);
        const absolutePath = normalisedPath(path.join(this._rootDir, relativePath));

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

    this._cache.setHashes(this._fileMap);
  }
}
