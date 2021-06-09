export type BettererFileGlobs = ReadonlyArray<string | ReadonlyArray<string>>;
export type BettererFilePaths = ReadonlyArray<string>;
export type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;

export type BettererFileCacheMap = Record<string, string>;

export type BettererFileCache = {
  checkCache(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
  enableCache(cachePath: string): void;
  writeCache(): Promise<void>;
};

export type BettererVersionControl = BettererFileCache & {
  filePaths: BettererFilePaths;

  getHash(absolutePath: string): string | null;
  isIgnored(filePath: string): boolean;
  sync(): Promise<void>;
};
