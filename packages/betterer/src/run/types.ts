import { BettererError } from '@betterer/errors';
import { WorkerRequireModule, WorkerRequireModuleAsync } from '@phenomnomnominal/worker-require';
import { BettererConfig } from '../config';

import { BettererDelta } from '../context';
import { BettererFilePaths } from '../fs';
import { BettererResult } from '../results';
import { BettererDiff } from '../test';

export type BettererRuns = ReadonlyArray<BettererRun>;
export type BettererRunNames = Array<string>;

export type BettererRun = {
  readonly baseline: BettererResult | null;
  readonly expected: BettererResult | null;
  readonly filePaths: BettererFilePaths | null;
  readonly name: string;

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
  readonly diff: BettererDiff | null;
  readonly delta: BettererDelta | null;
  readonly error: Error | null;
  readonly printed: string | null;
  readonly result: BettererResult | null;
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

export type BettererWorkerModule = WorkerRequireModule<typeof import('./run-worker')>;
export type BettererWorker = WorkerRequireModuleAsync<BettererWorkerModule>;

export type BettererWorkerRunConfig = Omit<BettererConfig, 'reporter' | 'workers'>;
