import { BettererRuns, BettererWatcher, BettererRunNames, BettererSummary } from '@betterer/betterer';

export type Paths = {
  config: string;
  results: string;
  cwd: string;
};

export type FixtureFileSystem = {
  paths: Paths;

  deleteFile(filePath: string): Promise<void>;
  readFile(filePath: string): Promise<string>;
  resolve(filePath: string): string;
  writeFile(filePath: string, text: string): Promise<void>;
  cleanup(): Promise<void>;
};

export type FixtureFileSystemFiles = Record<string, string>;

export type Fixture = FixtureFileSystem & {
  logs: ReadonlyArray<string>;
  waitForRun(watcher: BettererWatcher): Promise<BettererSummary>;
  runNames(runs: BettererRuns): BettererRunNames;
};

export type FixtureLogs = ReadonlyArray<string>;
