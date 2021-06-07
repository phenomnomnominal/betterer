import { BettererConfig } from '../config';
import { createHash } from '../hasher';
import { read } from '../reader';
import { BettererFilePaths } from '../runner';
import { normalisedPath } from '../utils';
import { forceRelativePaths, write } from '../writer';

type BettererCacheMap = Record<string, string>;

export class BettererCache {
  private _cache: boolean;
  private _cachePath: string;
  private _cacheMap: BettererCacheMap = {};
  private _reading: Promise<string | null> | null = null;

  constructor(config: BettererConfig) {
    this._cache = config.cache;
    this._cachePath = config.cachePath;
  }

  public async writeCache(): Promise<void> {
    if (!this._cache) {
      return;
    }
    const cacheString = forceRelativePaths(JSON.stringify(this._cacheMap, null, '  '), this._cachePath);
    await write(cacheString, this._cachePath);
  }

  public async checkCache(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    if (!this._cache) {
      return filePaths;
    }

    await this._readCache();

    const notCached: Array<string> = [];
    await Promise.all(
      filePaths.map(async (filePath) => {
        const content = await read(filePath);
        if (content == null) {
          return;
        }

        const hash = createHash(content);

        const cachePath = normalisedPath(filePath);
        // If the file isn't cached, or it is cached but its contents have changed, add it to the list:
        if (!this._cacheMap[cachePath] || this._cacheMap[cachePath] !== hash) {
          notCached.push(filePath);
        }

        this._cacheMap[cachePath] = hash;
      })
    );

    return notCached;
  }

  private async _readCache(): Promise<void> {
    if (!this._cache) {
      return;
    }
    if (!this._reading) {
      this._reading = read(this._cachePath);
    }
    const cache = await this._reading;
    if (!cache) {
      return;
    }

    this._cacheMap = JSON.parse(cache) as BettererCacheMap;
  }
}
