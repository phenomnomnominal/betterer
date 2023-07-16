import type { BettererTestNames, BettererRunSummaries } from '@betterer/betterer';

export interface Paths {
  cache: string;
  config: string;
  results: string;
  cwd: string;
}

export interface FixtureFileSystem {
  paths: Paths;

  deleteDirectory(filePath: string): Promise<void>;
  deleteFile(filePath: string): Promise<void>;
  readFile(filePath: string): Promise<string>;
  resolve(filePath: string): string;
  writeFile(filePath: string, text: string): Promise<void>;
  cleanup(): Promise<void>;
}

export type FixtureFileSystemFiles = Record<string, string>;

export type Fixture = FixtureFileSystem & {
  logs: ReadonlyArray<string>;
  testNames(runs: BettererRunSummaries): BettererTestNames;
};

export type FixtureLogs = ReadonlyArray<string>;

export interface FixtureOptions {
  logFilters?: Array<RegExp>;
}

export type FixtureFactory = (
  fixtureName: string,
  files?: FixtureFileSystemFiles,
  options?: FixtureOptions
) => Promise<Fixture>;
