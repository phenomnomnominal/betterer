import path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

import { createHash } from '../hasher';
import { BettererFileCacheΩ } from './file-cache';
import { read } from './reader';
import { BettererFilePaths, BettererVersionControl } from './types';

export class BettererGit implements BettererVersionControl {
  private _cache: BettererFileCacheΩ;
  private _fileMap: Record<string, string> = {};
  private _filePaths: Array<string> = [];
  private _git: SimpleGit;
  private _rootDir: string;
  private _syncing: Promise<void> | null = null;

  constructor(private _gitDir: string) {
    this._rootDir = path.dirname(this._gitDir);
    this._git = simpleGit(this._rootDir);
    this._cache = new BettererFileCacheΩ(this);
  }

  public checkCache(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    return this._cache.checkCache(filePaths);
  }

  public enableCache(cachePath: string): void {
    this._cache.enableCache(cachePath);
  }

  public writeCache(): Promise<void> {
    return this._cache.writeCache();
  }

  public get filePaths(): BettererFilePaths {
    return this._filePaths;
  }

  public getHash(absolutePath: string): string | null {
    return this._fileMap[absolutePath] || null;
  }

  public isIgnored(absolutePath: string): boolean {
    return !this._fileMap[absolutePath];
  }

  public async init(): Promise<void> {
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

  private async _getUntrackedHash(filePath: string): Promise<string | null> {
    const content = await read(filePath);
    if (content == null) {
      return null;
    }

    return createHash(content);
  }

  private _toLines(output: string): Array<string> {
    if (output.length === 0) {
      return [];
    }
    return output.trimEnd().split('\n');
  }

  private async _sync(): Promise<void> {
    const tree = await this._git.raw(['ls-tree', '--full-tree', '-r', 'HEAD']);
    const fileInfo = this._toLines(tree).map((info) => info.split(/\s/));
    this._fileMap = {};
    this._filePaths = fileInfo.map((fileInfo) => {
      const [, , hash, relativePath] = fileInfo;
      const absolutePath = path.join(this._rootDir, relativePath.trimStart());
      this._fileMap[absolutePath] = hash;
      return absolutePath;
    });
    const untracked = await this._git.raw(['ls-files', '--others', '--exclude-standard']);
    // If the file isn't tracked by git, compute hashes manually
    const untrackedFilePaths = this._toLines(untracked);
    await Promise.all(
      untrackedFilePaths.map(async (relativePath) => {
        const absolutePath = path.join(this._rootDir, relativePath);
        const hash = await this._getUntrackedHash(absolutePath);
        if (hash == null) {
          return;
        }
        this._fileMap[absolutePath] = hash;
        this._filePaths.push(absolutePath);
      })
    );
    const deleted = await this._git.raw(['ls-files', '--deleted']);
    const deletedFilePaths = this._toLines(deleted);
    deletedFilePaths.forEach((relativePath) => {
      const absolutePath = path.join(this._rootDir, relativePath);
      delete this._fileMap[absolutePath];
      this._filePaths.splice(this._filePaths.indexOf(absolutePath), 1);
    });
  }
}
