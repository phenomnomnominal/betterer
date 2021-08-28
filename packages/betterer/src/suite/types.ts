import { BettererFilePaths } from '../fs';
import { BettererRunNames, BettererRuns, BettererRunSummaries } from '../run';

export type BettererSuite = {
  readonly filePaths: BettererFilePaths;
  readonly runs: BettererRuns;
};

export type BettererSuiteSummary = BettererSuite & {
  readonly runs: BettererRunSummaries;
  readonly changed: BettererRunNames;

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
