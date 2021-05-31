import { BettererConfig } from '../config';
import { createHash } from '../hasher';
import { read } from '../reader';
import { normalisedPath } from '../utils';
import { write } from '../writer';
import { BettererFileResolverΩ } from './file-resolver';
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

  public async getRequested(resolver: BettererFileResolverΩ): Promise<BettererFilePaths> {
    return await resolver.files(this.filePaths);
  }

  public async getActual(resolver: BettererFileResolverΩ): Promise<BettererFilePaths> {
    const requestedFilePaths = await this.getRequested(resolver);

    if (!this._cache) {
      return requestedFilePaths;
    }

    const actualFilePaths: Array<string> = [];
    await Promise.all(
      requestedFilePaths.map(async (filePath) => {
        const content = await read(filePath);
        if (content == null) {
          return;
        }
        const hash = createHash(content);
        const relativePath = normalisedPath(filePath.replace(resolver.cwd, ''));
        if (!this._cacheMap[relativePath] || this._cacheMap[relativePath] !== hash) {
          actualFilePaths.push(filePath);
        }
        this._cacheMap[relativePath] = hash;
      })
    );

    return actualFilePaths;
  }
}
