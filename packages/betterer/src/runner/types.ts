import { BettererFilePaths } from '../fs';
import { BettererSuiteSummary } from '../suite';

export type BettererRunHandler = (suiteSummary: BettererSuiteSummary) => void;

export type BettererRunner = {
  queue(filePaths?: string | BettererFilePaths, handler?: BettererRunHandler): Promise<void>;
  stop(force: true): Promise<BettererSuiteSummary | null>;
  stop(): Promise<BettererSuiteSummary>;
};

export type BettererRunnerJob = {
  filePaths: BettererFilePaths;
  handler?: BettererRunHandler;
};
export type BettererRunnerJobs = Array<BettererRunnerJob>;
