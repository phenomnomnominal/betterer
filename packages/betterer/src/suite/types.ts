import { BettererFilePaths } from '../fs';
import { BettererRuns, BettererRunSummaries } from '../run';

export type BettererSuite = {
  readonly filePaths: BettererFilePaths;
  readonly runs: BettererRuns;
};

export type BettererSuiteSummary = BettererSuite & {
  readonly runs: BettererRunSummaries;
  readonly result: string;
  readonly expected: string | null;
  readonly unexpectedDiff: boolean;

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

export type BettererSuiteSummaries = Array<BettererSuiteSummary>;
