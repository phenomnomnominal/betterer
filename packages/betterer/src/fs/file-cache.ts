import { read } from './reader';
import { BettererFilePaths, BettererFileCacheMap, BettererFileCache, BettererVersionControl } from './types';
import { forceRelativePaths, write } from './writer';

export class BettererFileCacheΩ implements BettererFileCache {
  private _cachePath: string | null = null;
  private _cacheMap: BettererFileCacheMap = {};
  private _reading: Promise<string | null> | null = null;

  constructor(private _versionControl: BettererVersionControl) {}

  public enableCache(cachePath: string): void {
    this._cachePath = cachePath;
  }

  public async writeCache(): Promise<void> {
    if (!this._cachePath) {
      return;
    }

    // Clean up any expired cache entries before writing to disk:
    Object.keys(this._cacheMap).forEach((filePath) => {
      const hash = this._versionControl.getHash(filePath);
      if (hash === null) {
        delete this._cacheMap[filePath];
      }
    });

    const cacheString = forceRelativePaths(JSON.stringify(this._cacheMap, null, '  '), this._cachePath);
    await write(cacheString, this._cachePath);
  }

  public async checkCache(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    if (!this._cachePath) {
      return filePaths;
    }

    await this._readCache();

    const notCached: Array<string> = [];
    filePaths.map((filePath) => {
      const hash = this._versionControl.getHash(filePath);
      // If hash is null, then the file isn't tracked by version control *and* it can't be read,
      // so it probably doesn't exist
      if (hash === null) {
        return;
      }

      // If the file isn't cached, or it is cached but its contents have changed, add it to the list:
      if (!this._cacheMap[filePath] || this._cacheMap[filePath] !== hash) {
        notCached.push(filePath);
      }
      this._cacheMap[filePath] = hash;
    });

    return notCached;
  }

  private async _readCache(): Promise<void> {
    if (!this._cachePath) {
      return;
    }
    if (!this._reading) {
      this._reading = read(this._cachePath);
    }
    const cache = await this._reading;
    if (!cache) {
      return;
    }

    this._cacheMap = JSON.parse(cache) as BettererFileCacheMap;
  }
}
