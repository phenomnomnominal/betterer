import { BettererSummary } from '../context';

export type BettererFileGlobs = ReadonlyArray<string | ReadonlyArray<string>>;
export type BettererFilePaths = ReadonlyArray<string>;
export type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;

export type BettererRunHandler = (summary: BettererSummary) => void;

export type BettererRunner = {
  queue(filePaths?: string | BettererFilePaths, handler?: BettererRunHandler): Promise<void>;
  stop(force: true): Promise<BettererSummary | null>;
  stop(): Promise<BettererSummary>;
};

export type BettererRunnerJob = {
  filePaths: BettererFilePaths;
  handler?: BettererRunHandler;
};
export type BettererRunnerJobs = Array<BettererRunnerJob>;
