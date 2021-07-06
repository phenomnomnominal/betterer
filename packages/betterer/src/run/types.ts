import { BettererError } from '@betterer/errors';

import { BettererDelta } from '../context';
import { BettererFilePaths } from '../fs';
import { BettererResult } from '../results';
import { BettererDiff, BettererTestConfig } from '../test';

export type BettererRuns = ReadonlyArray<BettererRun>;
export type BettererRunNames = Array<string>;

export type BettererRun = {
  readonly expected: BettererResult;
  readonly filePaths: BettererFilePaths | null;
  readonly name: string;
  readonly test: BettererTestConfig;
  readonly timestamp: number;
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
  readonly error: BettererError;
  readonly result: BettererResult;
  readonly timestamp: number;

  readonly isBetter: boolean;
  readonly isComplete: boolean;
  readonly isExpired: boolean;
  readonly isFailed: boolean;
  readonly isSame: boolean;
  readonly isUpdated: boolean;
  readonly isWorse: boolean;
};

export type BettererRunSummaries = Array<BettererRunSummary>;
