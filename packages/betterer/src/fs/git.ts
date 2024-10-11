import type { SimpleGit } from 'simple-git';

import type { BettererFileCacheΩ } from './file-cache.js';
import type {
  BettererFileCache,
  BettererFileHashMap,
  BettererFilePath,
  BettererFilePaths,
  BettererVersionControl
} from './types.js';

import { invariantΔ } from '@betterer/errors';
import path from 'node:path';
import { simpleGit } from 'simple-git';

import { createHash } from '../hasher.js';
import { normalisedPath } from '../utils.js';
import { read } from './reader.js';

export class BettererGitΩ implements BettererVersionControl {
  private _fileMap: BettererFileHashMap = new Map();
  private _filePaths: Array<string> = [];
  private _syncing: Promise<void> | null = null;

  private constructor(
    private _git: SimpleGit,
    private _rootDir: BettererFilePath
  ) {}

  public static async create(
    cache: BettererFileCache | null,
    versionControlPath: BettererFilePath
  ): Promise<BettererGitΩ> {
    const git = simpleGit(versionControlPath);
    const versionControl = new BettererGitΩ(git, versionControlPath);
    await versionControl.sync(cache);
    return versionControl;
  }

  public async add(resultsPath: string): Promise<void> {
    await this._git.add(resultsPath);
  }

  public getFilePaths(): BettererFilePaths {
    return this._filePaths;
  }

  public async sync(cache: BettererFileCache | null): Promise<void> {
    if (this._syncing) {
      await this._syncing;
      return;
    }
    this._syncing = this._sync(cache);
    await this._syncing;
    this._syncing = null;
  }

  private async _getFileHash(filePath: string): Promise<string | null> {
    const content = await read(filePath);
    if (content == null) {
      return null;
    }

    return createHash(content);
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

  private _toFileInfo(line: string): [string, string] {
    const [, , hash, relativePath] = line.split(/\s/);
    invariantΔ(hash && relativePath, 'Invalid data from git output!');
    return [hash, relativePath];
  }

  private async _sync(cache: BettererFileCache | null): Promise<void> {
    this._fileMap = new Map();
    this._filePaths = [];

    const fileHashes: Record<string, string | null> = {};

    // Collect hashes from git:
    const treeOutput = await this._git.raw(['ls-tree', '--full-tree', '-r', 'HEAD']);
    const fileInfo = this._toLines(treeOutput).map((line) => this._toFileInfo(line));
    fileInfo.forEach((fileInfo) => {
      const [hash, relativePath] = fileInfo;
      const absolutePath = toAbsolutePath(this._rootDir, relativePath);
      fileHashes[absolutePath] = hash;
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
        const hash = fileHashes[absolutePath] ?? (await this._getFileHash(absolutePath));

        // If hash is null then the file was deleted so it shouldn't be included:
        if (hash == null) {
          return;
        }

        this._fileMap.set(absolutePath, hash);
        this._filePaths.push(absolutePath);
      })
    );

    if (!cache) {
      return;
    }
    const cacheΩ = cache as BettererFileCacheΩ;
    cacheΩ.setHashes(this._fileMap);
  }
}

function toAbsolutePath(rootDir: string, relativePath: string): string {
  return normalisedPath(path.join(rootDir, relativePath.trimStart()));
}
