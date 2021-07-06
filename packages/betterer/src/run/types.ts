import { BettererError } from '@betterer/errors';
import { AsyncWorkerModule, WorkerModule } from '@phenomnomnominal/worker-require';

import { BettererDelta } from '../context';
import { BettererFilePaths } from '../fs';
import { BettererResult } from '../results';
import { BettererDiff, BettererTestConfig } from '../test';
import { BettererWorkerRunSummaryΩ } from './worker-run-summary';

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
  failed(error: BettererError): Promise<BettererWorkerRunSummaryΩ>;
  done(result: BettererResult): Promise<BettererWorkerRunSummaryΩ>;
  skipped(): Promise<BettererWorkerRunSummaryΩ>;
};

export type BettererRunSummary = BettererRun & {
  readonly diff: BettererDiff;
  readonly delta: BettererDelta | null;
  readonly error: BettererError;
  readonly result: BettererResult;

  readonly isBetter: boolean;
  readonly isComplete: boolean;
  readonly isExpired: boolean;
  readonly isFailed: boolean;
  readonly isSame: boolean;
  readonly isUpdated: boolean;
  readonly isWorse: boolean;
};

export type BettererRunSummaries = Array<BettererRunSummary>;

export type BettererWorker = AsyncWorkerModule<WorkerModule<typeof import('./worker-run')>>;
export type BettererWorkers = Array<BettererWorker>;
