import { WorkerRequireModule, WorkerRequireModuleAsync } from '@phenomnomnominal/worker-require';

export type BettererFileGlobs = ReadonlyArray<string | ReadonlyArray<string>>;
export type BettererFilePath = string;
export type BettererFilePaths = ReadonlyArray<BettererFilePath>;
export type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;

export type BettererFileHashMap = Record<string, string>;
export type BettererTestCacheMap = Record<string, BettererFileHashMap>;
export type BettererCacheFile = {
  version: number;
  testCache: BettererTestCacheMap;
};

export type BettererFileCache = {
  clearCache(testName: string): void;
  filterCached(testName: string, filePaths: BettererFilePaths): BettererFilePaths;
  enableCache(cachePath: string): Promise<void>;
  updateCache(testName: string, filePaths: BettererFilePaths): void;
  writeCache(): Promise<void>;
};

export type BettererVersionControl = BettererFileCache & {
  add(resultsPath: string): Promise<void>;
  getFilePaths(): BettererFilePaths;
  filterIgnored(filePaths: BettererFilePaths): BettererFilePaths;
  sync(): Promise<void>;
};

export type BettererVersionControlWorkerModule = WorkerRequireModule<typeof import('./version-control-worker')>;
export type BettererVersionControlWorker =
  WorkerRequireModuleAsync<BettererVersionControlWorkerModule>['versionControl'];

export type BettererFileResolver = {
  baseDirectory: string;
  files(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
  resolve(...pathSegments: Array<string>): string;
  validate(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
};
