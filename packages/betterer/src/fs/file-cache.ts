import assert from 'assert';
import path from 'path';
import { read } from './reader';
import { BettererFilePaths, BettererFileCacheMap, BettererFileCache, BettererVersionControl } from './types';
import { forceRelativePaths, write } from './writer';

export class BettererFileCacheΩ implements BettererFileCache {
  private _cachePath: string | null = null;
  private _diskCacheMap: BettererFileCacheMap = {};
  private _memoryCacheMap: BettererFileCacheMap = {};
  private _reading: Promise<string | null> | null = null;

  constructor(private _versionControl: BettererVersionControl) {}

  public async enableCache(cachePath: string): Promise<void> {
    this._cachePath = cachePath;
    this._diskCacheMap = await this._readCache(this._cachePath);
  }

  public async writeCache(): Promise<void> {
    if (!this._cachePath) {
      return;
    }

    // Clean up any expired cache entries before writing to disk:
    Object.keys(this._memoryCacheMap).forEach((filePath) => {
      const hash = this._versionControl.getHash(filePath);
      if (hash === null) {
        delete this._memoryCacheMap[filePath];
      }
    });

    const cacheString = forceRelativePaths(JSON.stringify(this._memoryCacheMap, null, '  '), this._cachePath);
    await write(cacheString, this._cachePath);
    this._diskCacheMap = this._memoryCacheMap;
  }

  public checkCache(filePath: string): boolean {
    if (!this._cachePath) {
      return false;
    }

    const hash = this._versionControl.getHash(filePath);

    // If hash is null, then the file isn't tracked by version control *and* it can't be read,
    // so it probably doesn't exist
    if (hash === null) {
      return false;
    }

    this._memoryCacheMap[filePath] = hash;
    const previousHash = this._diskCacheMap[filePath];
    return hash === previousHash;
  }

  public updateCache(filePaths: BettererFilePaths): void {
    if (!this._cachePath) {
      return;
    }

    filePaths.forEach((filePath) => {
      const hash = this._versionControl.getHash(filePath);

      // If hash is null, then the file isn't tracked by version control *and* it can't be read,
      // so it probably doesn't exist
      if (hash === null) {
        return;
      }

      this._memoryCacheMap[filePath] = hash;
    });
  }

  private async _readCache(cachePath: string): Promise<BettererFileCacheMap> {
    if (!this._reading) {
      this._reading = read(cachePath);
    }
    const cache = await this._reading;
    this._reading = null;
    if (!cache) {
      return {};
    }

    const relativeCacheMap = JSON.parse(cache) as BettererFileCacheMap;

    // Transform relative paths back into absolute paths:
    const absoluteCacheMap: BettererFileCacheMap = {};
    assert(this._cachePath);
    Object.keys(relativeCacheMap).forEach((relativePath) => {
      const absolutePath = path.join(path.dirname(this._cachePath as string), relativePath);
      absoluteCacheMap[absolutePath] = relativeCacheMap[relativePath];
    });
    return absoluteCacheMap;
  }
}
