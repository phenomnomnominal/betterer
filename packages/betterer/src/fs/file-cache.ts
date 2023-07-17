import type {
  BettererFilePaths,
  BettererTestCacheMap,
  BettererFileCache,
  BettererFileHashMap,
  BettererCacheFile
} from './types.js';

import assert from 'node:assert';
import path from 'node:path';
import { normalisedPath } from '../utils.js';
import { read } from './reader.js';
import { write } from './writer.js';

const BETTERER_CACHE_VERSION = 2;

// The BettererFileCacheΩ is a simple JSON cache of test + file data.
// Each test has it's own cache entry, which is a list of hashes:
//
// {
//   "version": 2,
//   "testCache": {
//     "test name": {
//        "relative file path": "hash",
//        "another relative file path": "another hash"
//        ...
//     }
//   }
// }
//
// Each stored hash is the concatenated hash of the Betterer config files
// and the file at that path at the point it is written. It is written each
// time a test runs on a given file and the file gets better, stays the same,
// or gets updated. If the hash hasn't changed, then the config file hasn't
// changed, and the file hasn't changed, so running the test on the file again
// *should* have the same result.
//
// Of course the actual test itself could have changed so ... 🤷‍♂️

export class BettererFileCacheΩ implements BettererFileCache {
  private _cachePath: string | null = null;
  private _fileHashMap: BettererFileHashMap = {};
  private _memoryCacheMap: BettererTestCacheMap = {};
  private _reading: Promise<string | null> | null = null;

  constructor(private _configPaths: BettererFilePaths) {}

  public clearCache(testName: string): void {
    delete this._memoryCacheMap[testName];
  }

  public async enableCache(cachePath: string): Promise<void> {
    this._cachePath = cachePath;
    this._memoryCacheMap = await this._readCache(this._cachePath);
  }

  public async writeCache(): Promise<void> {
    if (!this._cachePath) {
      return;
    }

    // Clean up any expired cache entries before writing to disk:
    Object.keys(this._memoryCacheMap).forEach((testName) => {
      const testCache = this._memoryCacheMap[testName];
      Object.keys(testCache).forEach((filePath) => {
        const hash = this._fileHashMap[filePath];
        if (hash === null) {
          delete this._memoryCacheMap[filePath];
        }
      });
    });

    const relativeTestCache: BettererTestCacheMap = {};
    Object.keys(this._memoryCacheMap).forEach((testName) => {
      const absoluteFileHashMap = this._memoryCacheMap[testName];
      const relativeFileHashMap: BettererFileHashMap = {};
      Object.keys(absoluteFileHashMap).forEach((absoluteFilePath) => {
        assert(this._cachePath);
        const relativePath = normalisedPath(path.relative(path.dirname(this._cachePath), absoluteFilePath));
        relativeFileHashMap[relativePath] = absoluteFileHashMap[absoluteFilePath];
      });
      relativeTestCache[testName] = relativeFileHashMap;
    });
    const cache = { version: BETTERER_CACHE_VERSION, testCache: relativeTestCache };
    const cacheString = JSON.stringify(cache, null, '  ');
    await write(cacheString, this._cachePath);
  }

  public filterCached(testName: string, filePaths: BettererFilePaths): BettererFilePaths {
    if (!this._cachePath) {
      return filePaths;
    }

    const testCache = this._memoryCacheMap[testName] || {};
    return filePaths.filter((filePath) => {
      const hash = this._fileHashMap[filePath];

      // If hash is null, then the file isn't tracked by version control *and* it can't be read,
      // so it probably doesn't exist
      if (hash === null) {
        return true;
      }

      const previousHash = testCache[filePath];
      return hash !== previousHash;
    });
  }

  public updateCache(testName: string, filePaths: BettererFilePaths): void {
    if (!this._cachePath) {
      return;
    }

    this._memoryCacheMap[testName] = this._memoryCacheMap[testName] || {};
    const testCache = this._memoryCacheMap[testName];

    const existingFilePaths = Object.keys(testCache);

    const cacheFilePaths = Array.from(new Set([...existingFilePaths, ...filePaths])).sort();

    const updatedCache: BettererFileHashMap = {};
    cacheFilePaths.forEach((filePath) => {
      const hash = this._fileHashMap[filePath];

      // If hash is null, then the file isn't tracked by version control *and* it can't be read,
      // so it probably doesn't exist
      if (hash === null) {
        return;
      }

      updatedCache[filePath] = hash;
    });

    this._memoryCacheMap[testName] = updatedCache;
  }

  public setHashes(newHashes: BettererFileHashMap): void {
    if (!this._cachePath) {
      return;
    }
    const configHash = this._getConfigHash(newHashes);
    this._fileHashMap = {};
    Object.keys(newHashes).forEach((absolutePath) => {
      this._fileHashMap[absolutePath] = `${configHash}${newHashes[absolutePath]}`;
    });
  }

  private async _readCache(cachePath: string): Promise<BettererTestCacheMap> {
    if (!this._reading) {
      this._reading = read(cachePath);
    }
    const cache = await this._reading;
    this._reading = null;
    if (!cache) {
      return {};
    }

    const parsedCache = JSON.parse(cache) as BettererCacheFile;
    const { version } = parsedCache;
    if (!version) {
      return {};
    }

    const relativeTestCacheMap = parsedCache.testCache;

    // Transform relative paths back into absolute paths:
    const absoluteTestCacheMap: BettererTestCacheMap = {};
    Object.keys(relativeTestCacheMap).forEach((testName) => {
      const relativeFileHashMap = relativeTestCacheMap[testName];
      const absoluteFileHashMap: BettererFileHashMap = {};
      Object.keys(relativeFileHashMap).forEach((relativePath) => {
        assert(this._cachePath);
        const absolutePath = normalisedPath(path.resolve(path.dirname(this._cachePath), relativePath));
        absoluteFileHashMap[absolutePath] = relativeFileHashMap[relativePath];
      });
      absoluteTestCacheMap[testName] = absoluteFileHashMap;
    });
    return absoluteTestCacheMap;
  }

  private _getConfigHash(newFileHashMap: BettererFileHashMap): string {
    return this._configPaths.map((configPath) => newFileHashMap[normalisedPath(configPath)]).join('');
  }
}
