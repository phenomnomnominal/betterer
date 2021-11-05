import { BettererFilePaths } from '../fs';
import { BettererRuns, BettererRunSummaries } from '../run';
import { BettererTestNames } from '../test';

export type BettererSuite = {
  readonly filePaths: BettererFilePaths;
  readonly runs: BettererRuns;
};

export type BettererSuiteSummary = {
  readonly filePaths: BettererFilePaths;
  readonly runs: BettererRuns;
  readonly runSummaries: BettererRunSummaries;
  readonly changed: BettererTestNames;

  readonly better: BettererRunSummaries;
  readonly completed: BettererRunSummaries;
  readonly expired: BettererRunSummaries;
  readonly failed: BettererRunSummaries;
  readonly new: BettererRunSummaries;
  readonly ran: BettererRunSummaries;
  readonly same: BettererRunSummaries;
  readonly skipped: BettererRunSummaries;
  readonly updated: BettererRunSummaries;
  readonly worse: BettererRunSummaries;
};

export type BettererSuiteSummaries = ReadonlyArray<BettererSuiteSummary>;
