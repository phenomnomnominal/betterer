import type {
  BettererCacheFile,
  BettererFileCache,
  BettererFilePaths,
  BettererFileHashMap,
  BettererFileHashMapSerialised,
  BettererTestCacheMap,
  BettererTestCacheMapSerialised
} from './types.js';

import { invariant } from '@betterer/errors';
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
  private _fileHashMap: BettererFileHashMap = new Map();
  private _memoryCacheMap: BettererTestCacheMap = new Map();
  private _reading: Promise<string | null> | null = null;

  constructor(private _configPaths: BettererFilePaths) {}

  public clearCache(testName: string): void {
    this._memoryCacheMap.delete(testName);
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
    [...this._memoryCacheMap.entries()].forEach(([, fileHashMap]) => {
      [...fileHashMap.entries()].forEach(([filePath]) => {
        const hash = this._fileHashMap.get(filePath);
        if (hash == null) {
          this._memoryCacheMap.delete(filePath);
        }
      });
    });

    // Convert Map to Record so it can be serialised to disk:
    const relativeTestCache: BettererTestCacheMapSerialised = {};
    [...this._memoryCacheMap.entries()].forEach(([testName, absoluteFileHashMap]) => {
      const relativeFileHashMap: BettererFileHashMapSerialised = {};
      [...absoluteFileHashMap.entries()].forEach(([absoluteFilePath, hash]) => {
        invariant(this._cachePath, `\`this._cachePath\` should have been validated above!`, this._cachePath);
        const relativePath = normalisedPath(path.relative(path.dirname(this._cachePath), absoluteFilePath));
        relativeFileHashMap[relativePath] = hash;
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

    const testCache = this._memoryCacheMap.get(testName) ?? (new Map() as BettererTestCacheMap);
    return filePaths.filter((filePath) => {
      const hash = this._fileHashMap.get(filePath);

      // If hash is null, then the file isn't tracked by version control *and* it can't be read,
      // so it probably doesn't exist
      if (hash == null) {
        return true;
      }

      const previousHash = testCache.get(filePath);
      return hash !== previousHash;
    });
  }

  public updateCache(testName: string, filePaths: BettererFilePaths): void {
    if (!this._cachePath) {
      return;
    }

    if (!this._memoryCacheMap.get(testName)) {
      this._memoryCacheMap.set(testName, new Map());
    }
    const testCache = this._memoryCacheMap.get(testName);
    invariant(testCache, '`testCache` entry should have been validated above!', testCache);
    const existingFilePaths = [...testCache.keys()];

    const cacheFilePaths = Array.from(new Set([...existingFilePaths, ...filePaths])).sort();

    const updatedCache: BettererFileHashMap = new Map();
    cacheFilePaths.forEach((filePath) => {
      const hash = this._fileHashMap.get(filePath);

      // If hash is null, then the file isn't tracked by version control *and* it can't be read,
      // so it probably doesn't exist
      if (hash == null) {
        return;
      }

      updatedCache.set(filePath, hash);
    });

    this._memoryCacheMap.set(testName, updatedCache);
  }

  public setHashes(newHashes: BettererFileHashMap): void {
    if (!this._cachePath) {
      return;
    }
    const configHash = this._getConfigHash(newHashes);
    this._fileHashMap = new Map();
    [...newHashes.entries()].forEach(([absolutePath, hash]) => {
      this._fileHashMap.set(absolutePath, `${configHash}${hash}`);
    });
  }

  private async _readCache(cachePath: string): Promise<BettererTestCacheMap> {
    if (!this._reading) {
      this._reading = read(cachePath);
    }
    const cache = await this._reading;
    this._reading = null;
    if (!cache) {
      return new Map();
    }

    const parsed = JSON.parse(cache) as BettererCacheFile;
    const { version } = parsed;
    if (!version) {
      return new Map();
    }

    // Transform serialised Record with relative paths back into
    // Map with absolute paths:
    const absoluteTestCacheMap: BettererTestCacheMap = new Map();
    Object.entries(parsed.testCache).forEach(([testName, serialisedEntries]) => {
      const absoluteFileHashMap: BettererFileHashMap = new Map();
      Object.entries(serialisedEntries).forEach(([relativePath, hash]) => {
        invariant(this._cachePath, `\`this._cachePath\` should have been validated above!`, this._cachePath);
        const absolutePath = normalisedPath(path.resolve(path.dirname(this._cachePath), relativePath));
        absoluteFileHashMap.set(absolutePath, hash);
      });
      absoluteTestCacheMap.set(testName, absoluteFileHashMap);
    });
    return absoluteTestCacheMap;
  }

  private _getConfigHash(newFileHashMap: BettererFileHashMap): string {
    return this._configPaths.map((configPath) => newFileHashMap.get(normalisedPath(configPath))).join('');
  }
}
