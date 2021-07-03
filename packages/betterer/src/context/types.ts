import { BettererError } from '@betterer/errors';

import { BettererConfig } from '../config';
import { BettererFilePaths } from '../fs';
import { BettererResult } from '../results';
import { BettererDiff, BettererTestConfig } from '../test';

export type BettererRuns = ReadonlyArray<BettererRun>;
export type BettererRunNames = Array<string>;

export type BettererContext = {
  readonly config: BettererConfig;
};

export type BettererContextStarted = {
  end(): Promise<void>;
  error(error: BettererError): Promise<void>;
};

export type BettererDelta =
  | {
      readonly baseline: number;
      readonly diff: number;
      readonly result: number;
    }
  | {
      readonly baseline: null;
      readonly diff: 0;
      readonly result: number;
    };

export type BettererRun = {
  readonly expected: BettererResult;
  readonly filePaths: BettererFilePaths | null;
  readonly name: string;
  readonly test: BettererTestConfig;
  readonly isNew: boolean;
  readonly isSkipped: boolean;
};

export type BettererReporterRun = BettererRun & {
  lifecycle: Promise<BettererRunSummary>;
};

export type BettererRunning = {
  failed(error: BettererError): Promise<BettererRunSummary>;
  done(result: BettererResult): Promise<BettererRunSummary>;
  skipped(): Promise<BettererRunSummary>;
};

export type BettererRunSummary = BettererRun & {
  readonly diff: BettererDiff;
  readonly delta: BettererDelta | null;
  readonly result: BettererResult;
  readonly timestamp: number;
  readonly error: BettererError;

  readonly isBetter: boolean;
  readonly isComplete: boolean;
  readonly isExpired: boolean;
  readonly isFailed: boolean;
  readonly isSame: boolean;
  readonly isUpdated: boolean;
  readonly isWorse: boolean;
};

export type BettererRunSummaries = Array<BettererRunSummary>;

export type BettererSummary = {
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

export type BettererSummaries = Array<BettererSummary>;
