import { BettererError } from '@betterer/errors';
import { WorkerRequireModule, WorkerRequireModuleAsync } from '@phenomnomnominal/worker-require';

import { BettererFilePaths } from '../fs';
import { BettererResult } from '../results';
import { BettererDiff } from '../test';

/**
 * @public the change between a test runs and its baseline. A {@link @betterer/betterer#BettererRun | `BettererRun`}
 * has a `delta` property if the test has a {@link @betterer/betterer#BettererTest.progress | `BettererTest.progress()` }
 * handler.
 */
export type BettererDelta =
  | {
      /**
       * The quantified baseline for the test. Set when the context is created and stays constant
       * across multiple runs. Set to `null` when it is a new test.
       */
      readonly baseline: number;
      /**
       * The difference between the current test result and the baseline. Set to `0` when it is a
       * new test.
       */
      readonly diff: number;
      /**
       * The quantified test result.
       */
      readonly result: number;
    }
  | {
      /**
       * The `baseline` is `null` when it is a new test.
       */
      readonly baseline: null;
      /**
       * The `diff` is `0` when it is a new test.
       */
      readonly diff: 0;
      /**
       * The quantified test result.
       */
      readonly result: number;
    };

export type BettererRun = {
  readonly baseline: BettererResult | null;
  readonly expected: BettererResult | null;
  readonly filePaths: BettererFilePaths | null;
  readonly name: string;

  readonly isNew: boolean;
  readonly isSkipped: boolean;
};

export type BettererRuns = ReadonlyArray<BettererRun>;

/**
 * @public An array of {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob }
 * patterns that match file paths that will be included in an operation. All globs should be
 * relative to the current {@link @betterer/betterer#BettererConfig.cwd | `BettererConfig.cwd`}.
 */
export type BettererRunNames = Array<string>;

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
