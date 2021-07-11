import { BettererError } from '@betterer/errors';
import { AsyncWorkerModule, WorkerModule } from '@phenomnomnominal/worker-require';
import { BettererConfig } from '../config';

import { BettererDelta } from '../context';
import { BettererFilePaths } from '../fs';
import { BettererResult } from '../results';
import { BettererDiff } from '../test';
import { BettererWorkerRunSummaryΩ } from './worker-run-summary';

export type BettererRuns = ReadonlyArray<BettererRun>;
export type BettererRunNames = Array<string>;

export type BettererRun = {
  readonly baseline: BettererResult;
  readonly expected: BettererResult;
  readonly filePaths: BettererFilePaths | null;
  readonly name: string;
  readonly timestamp: number;

  readonly isNew: boolean;
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
  readonly printed: string | null;
  readonly result: BettererResult;

  readonly isBetter: boolean;
  readonly isComplete: boolean;
  readonly isExpired: boolean;
  readonly isFailed: boolean;
  readonly isSame: boolean;
  readonly isSkipped: boolean;
  readonly isUpdated: boolean;
  readonly isWorse: boolean;
};

export type BettererRunSummaries = Array<BettererRunSummary>;

export type BettererWorker = AsyncWorkerModule<WorkerModule<typeof import('./run-worker')>>;
export type BettererWorkers = Array<BettererWorker>;

export type BettererWorkerRunConfig = Omit<BettererConfig, 'silent' | 'reporters'>;
