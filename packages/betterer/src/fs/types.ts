export type BettererFileGlobs = ReadonlyArray<string | ReadonlyArray<string>>;
export type BettererFilePaths = ReadonlyArray<string>;
export type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;

export type BettererFileCacheMap = Record<string, string>;

export type BettererFileCache = {
  checkCache(filePath: string): boolean;
  enableCache(cachePath: string): Promise<void>;
  updateCache(fiePaths: BettererFilePaths): void;
  writeCache(): Promise<void>;
};

export type BettererVersionControl = BettererFileCache & {
  filePaths: BettererFilePaths;

  add(resultsPath: string): Promise<void>;
  getHash(absolutePath: string): string | null;
  isIgnored(filePath: string): boolean;
  sync(): Promise<void>;
};
