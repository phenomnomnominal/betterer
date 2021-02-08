import { BettererRunNames, BettererRuns } from '@betterer/betterer';

export type Paths = {
  config: string;
  results: string;
  cwd: string;
};

export type FixtureFileSystem = {
  paths: Paths;

  deleteDirectory(filePath: string): Promise<void>;
  deleteFile(filePath: string): Promise<void>;
  readFile(filePath: string): Promise<string>;
  resolve(filePath: string): string;
  writeFile(filePath: string, text: string): Promise<void>;
  cleanup(): Promise<void>;
};

export type FixtureFileSystemFiles = Record<string, string>;

export type Fixture = FixtureFileSystem & {
  logs: ReadonlyArray<string>;
  runNames(runs: BettererRuns): BettererRunNames;
};

export type FixtureLogs = ReadonlyArray<string>;

export type FixtureOptions = {
  logFilters?: Array<RegExp>;
};

export type FixtureFactory = (
  fixtureName: string,
  files: FixtureFileSystemFiles,
  options?: FixtureOptions
) => Promise<Fixture>;
