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

export type FixtureRunSummary = { name: string };
export type FixtureRunSummaries = Array<FixtureRunSummary>;
export type FixtureTestNames = Array<string>;

export type Fixture = FixtureFileSystem & {
  logs: ReadonlyArray<string>;
  testNames(runs: FixtureRunSummaries): FixtureTestNames;
};

export type FixtureLogs = ReadonlyArray<string>;
export type FixtureMockDate = {
  getTime(): number;
};

export type FixtureMocks = FixtureMockDate;

export interface FixtureOptions {
  logFilters?: Array<RegExp>;
  mocks?: FixtureMocks;
}

export type FixtureFactory = (
  fixtureName: string,
  files?: FixtureFileSystemFiles,
  options?: FixtureOptions
) => Promise<Fixture>;
