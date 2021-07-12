import { AsyncWorkerModule, WorkerModule } from '@phenomnomnominal/worker-require';

export type BettererFileGlobs = ReadonlyArray<string | ReadonlyArray<string>>;
export type BettererFilePaths = ReadonlyArray<string>;
export type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;

export type BettererFileCacheMap = Record<string, string>;
export type BettererFileHashMap = Record<string, string>;

export type BettererFileCache = {
  filterCached(filePaths: BettererFilePaths): BettererFilePaths;
  enableCache(cachePath: string): Promise<void>;
  updateCache(filePaths: BettererFilePaths): void;
  writeCache(): Promise<void>;
};

export type BettererVersionControl = BettererFileCache & {
  add(resultsPath: string): Promise<void>;
  getFilePaths(): BettererFilePaths;
  filterIgnored(filePaths: BettererFilePaths): BettererFilePaths;
  sync(): Promise<void>;
};

export type BettererVersionControlWorkerModule = AsyncWorkerModule<
  WorkerModule<typeof import('./version-control-worker')>
>;

export type BettererVersionControlWorker = BettererVersionControlWorkerModule['git'];

export type BettererFileResolver = {
  baseDirectory: string;
  files(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
  resolve(...pathSegments: Array<string>): string;
  validate(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
};
