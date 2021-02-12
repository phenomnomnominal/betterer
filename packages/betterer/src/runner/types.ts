import { BettererSummary } from '../context';

export type BettererFilePaths = ReadonlyArray<string>;
export type BettererRunHandler = (summary: BettererSummary) => void;

export type BettererRunner = {
  queue(filePaths?: string | BettererFilePaths, handler?: BettererRunHandler): Promise<void>;
  stop(force?: true): Promise<BettererSummary | null>;
};

export type BettererRunnerJob = {
  filePaths: BettererFilePaths;
  handler?: BettererRunHandler;
};
export type BettererRunnerJobs = Array<BettererRunnerJob>;
