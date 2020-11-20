import { BettererFilePaths } from '../watcher';
import { BettererConfig } from '../config';
import { BettererResult } from '../results';
import { BettererDiff, BettererTestConfig } from '../test';

export type BettererRuns = ReadonlyArray<BettererRun>;
export type BettererRunNames = Array<string>;

export type BettererContext = {
  readonly config: BettererConfig;
  readonly lifecycle: Promise<BettererSummary>;
};

export type BettererRun = {
  readonly diff: BettererDiff;
  readonly expected: BettererResult;
  readonly filePaths: BettererFilePaths;
  readonly lifecycle: Promise<void>;
  readonly name: string;
  readonly result: BettererResult;
  readonly test: BettererTestConfig;
  readonly timestamp: number;

  readonly isBetter: boolean;
  readonly isComplete: boolean;
  readonly isExpired: boolean;
  readonly isFailed: boolean;
  readonly isNew: boolean;
  readonly isSame: boolean;
  readonly isSkipped: boolean;
  readonly isUpdated: boolean;
  readonly isWorse: boolean;
};

export type BettererSummary = {
  readonly runs: BettererRuns;
  readonly obsolete: BettererRunNames;
  readonly result: string;
  readonly expected: string | null;
  readonly hasDiff: boolean;

  readonly better: BettererRuns;
  readonly completed: BettererRuns;
  readonly expired: BettererRuns;
  readonly failed: BettererRuns;
  readonly new: BettererRuns;
  readonly ran: BettererRuns;
  readonly same: BettererRuns;
  readonly skipped: BettererRuns;
  readonly updated: BettererRuns;
  readonly worse: BettererRuns;
};
