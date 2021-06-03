import * as path from 'path';

import { BettererConfig } from '../config';
import { createHash } from '../hasher';
import { read } from '../reader';
import { write } from '../writer';
import { BettererFilePaths } from './types';

type BettererCache = Record<string, string>;

export class BettererFileManager {
  private _cache: boolean;
  private _cachePath: string;
  private _cacheMap: BettererCache = {};

  constructor(config: BettererConfig, private readonly _filePaths: BettererFilePaths) {
    this._cache = config.cache;
    this._cachePath = config.cachePath;
  }

  public get filePaths(): BettererFilePaths {
    return this._filePaths;
  }

  public async readCache(): Promise<void> {
    if (!this._cache) {
      return;
    }

    const cache = await read(this._cachePath);
    if (!cache) {
      return;
    }

    this._cacheMap = JSON.parse(cache) as BettererCache;
  }

  public async writeCache(): Promise<void> {
    if (!this._cache) {
      return;
    }
    await write(JSON.stringify(this._cacheMap, null, '  '), this._cachePath);
  }

  public async checkCache(filePaths: BettererFilePaths): Promise<BettererFilePaths> {
    if (!this._cache) {
      return filePaths;
    }

    const notCached: Array<string> = [];
    await Promise.all(
      filePaths.map(async (filePath) => {
        const content = await read(filePath);
        if (content == null) {
          return;
        }

        const hash = createHash(content);

        // Use `relativePath` for `_cacheMap` as it will be written to disk:
        const relativePath = path.relative(path.dirname(this._cachePath), filePath);

        // If the file isn't cached, or it is cached but its contents have changed, add it to the list:
        if (!this._cacheMap[relativePath] || this._cacheMap[relativePath] !== hash) {
          notCached.push(filePath);
        }

        this._cacheMap[relativePath] = hash;
      })
    );

    return notCached;
  }
}
