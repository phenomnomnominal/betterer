import { BettererError } from '@betterer/errors';
import { WorkerRequireModule, WorkerRequireModuleAsync } from '@phenomnomnominal/worker-require';

import { BettererFilePaths } from '../fs';
import { BettererResult } from '../results';
import { BettererDiff } from '../test';

/**
 * @public The change between a test runs and its baseline. A {@link @betterer/betterer#BettererRun | `BettererRun`}
 * has a `delta` property if the test has a {@link @betterer/betterer#BettererTestOptionsComplex.progress | `progress()` }
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

/**
 * @public A single {@link @betterer/betterer#BettererTest | `BettererTest`} run. Will become a
 * {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`} when the test run is
 * completed.
 *
 * @remarks A set of {@link @betterer/betterer#BettererRun | `BettererRun`s} make a {@link @betterer/betterer#BettererSuite | `BettererSuite`}.
 * You can get the `BettererRun` via the {@link @betterer/betterer#BettererReporter | `BettererReporter` }
 * interface.
 *
 * @example
 * ```typescript
 * const myReporter: BettererReporter = {
 *   // Access the run before any tests are run:
 *   runStart (run: BettererRun) {
 *     // ...
 *   },
 *   // Access the run when something goes wrong:
 *   runError (run: BettererRun) {
 *     // ...
 *   }
 * }
 * ```
 */
export type BettererRun = {
  /**
   * The baseline result for the test run. If the {@link @betterer/betterer#BettererTest | `BettererTest`}
   * gets better over the lifetime of the {@link @betterer/betterer#BettererContext}, `baseline`
   * will always reflect the original result. Will be `null` when `isNew` is `true`.
   */
  readonly baseline: BettererResult | null;
  /**
   * The expected result for the test run. Will always reflect the result from the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}.
   * If the {@link @betterer/betterer#BettererTest | `BettererTest`} gets better over the lifetime
   * of the {@link @betterer/betterer#BettererContext}, `expected` will reflect the current result.
   * Will be `null` when `isNew` is `true`.
   */
  readonly expected: BettererResult | null;
  /**
   * An array of file paths that will be tested. Will be `null` if the test is not a {@link @betterer/betterer#BettererFileTest | `BettererFileTest`}.
   * If it is an empty array then all relevant files for the test (as defined by {@link @betterer/betterer#BettererFileTest.include | `BettererFileTest.include()`}
   * and {@link @betterer/betterer#BettererFileTest.exclude | `BettererFileTest.exclude()`}) will be tested.
   */
  readonly filePaths: BettererFilePaths | null;
  /**
   * The name of the test for the run.
   */
  readonly name: string;

  /**
   * When `true`, this is the first time that a test has been run. Both `baseline` and `expected`
   * will be set to `null`. The default reporter will show that this test is new.
   */
  readonly isNew: boolean;
  /**
   * When `true`, this test has been skipped and the test function will not run. The default
   * reporter will show that this test has been skipped.
   */
  readonly isSkipped: boolean;
};

/**
 * @public An array of {@link @betterer/betterer#BettererRun | `BettererRun`s}.
 */
export type BettererRuns = ReadonlyArray<BettererRun>;

export type BettererReporterRun = BettererRun & {
  lifecycle: Promise<BettererRunSummary>;
};

export type BettererRunning = {
  failed(error: BettererError): Promise<BettererRunSummary>;
  done(result: BettererResult): Promise<BettererRunSummary>;
  skipped(): Promise<BettererRunSummary>;
};

/**
 * @public The summary of a {@link @betterer/betterer#BettererTest | `BettererTest`} run. Includes
 * everything from {@link @betterer/betterer#BettererRun | `BettererRun`}.
 *
 * @remarks You can get the `BettererRunSummary` via the {@link @betterer/betterer#BettererReporter | `BettererReporter` }
 * interface.
 *
 * @example
 * ```typescript
 * const myReporter: BettererReporter = {
 *   // Access the summary after the run has ended:
 *   runEnd (runSummary: BettererRunSummary) {
 *     // ...
 *   }
 * }
 * ```
 *
 * or by using {@link @betterer/betterer#BettererReporter | `BettererReporter`'s} Promise-based
 * `lifecycle` interface:
 *
 * @example
 * ```typescript
 * const myReporter: BettererReporter = {
 *   // Access the summary after the run has ended:
 *   runStart (run: BettererRun, lifecycle: Promise<BettererRunSummary>) {
 *     const summary: BettererRunSummary = await lifecycle;
 *     // ...
 *   }
 * }
 * ```
 */
export type BettererRunSummary = BettererRun & {
  /**
   * The verbose diff between the current test result and the expected result. Will be present when
   * `isWorse` is `true`.
   */
  readonly diff: BettererDiff | null;
  /**
   * The change between a test run's result and its baseline. Will be present when the test has a
   * `progress` handler and `isBetter`, `isNew`, `isSame` or `isWorse` is `true`.
   */
  readonly delta: BettererDelta | null;
  /**
   * The `error` that cause the run to fail. Will be present when `isFailed` is `true`.
   */
  readonly error: Error | null;
  readonly printed: string | null;
  /**
   * The result for the test run. Will be `null` when `isFailed` or `isSkipped` is `true`.
   */
  readonly result: BettererResult | null;
  /**
   * The time that the test started. Used for checking if a test has expired.
   */
  readonly timestamp: number;

  /**
   * When `true`, this test has become "better", based on the result of the `constraint` function.
   * The {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file} will
   * be updated with the new result. If the test has met its goal, `isComplete` will also be `true`.
   */
  readonly isBetter: boolean;
  /**
   * When `true`, this test has successfully met its goal. `isBetter` will also be `true` the first
   * time the test meets its goal. `isSame` will also be `true` on subsequent runs. The default
   * reporter will show that this test has met its goal.
   */
  readonly isComplete: boolean;
  /**
   * When `true`, this test has expired because its `deadline` has passed. The default reporter
   * will show that this test has expired.
   */
  readonly isExpired: boolean;
  /**
   * When `true`, this test has failed because the test function threw an error. The default
   * reporter will show that this test has failed.
   */
  readonly isFailed: boolean;
  /**
   * When `true`, this test is "the same", based on the result of the `constraint` function.
   * The {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file} will
   * be updated if the serialised result has changed, for example when a linting issue in a file
   * moves to a different location in the file.
   */
  readonly isSame: boolean;
  /**
   * When `true`, this test is "worse", based on the result of the `constraint` function, but the
   * `--update` flag was used. The {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file}
   * will be updated with the new result.
   */
  readonly isUpdated: boolean;
  /**
   * When `true`, this test is "worse", based on the result of the `constraint` function. The
   * {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file} will not
   * be updated.
   */
  readonly isWorse: boolean;
};

/**
 * @public An array of {@link @betterer/betterer#BettererRunSummary | `BettererRunSummaries`}.
 */
export type BettererRunSummaries = Array<BettererRunSummary>;

export type BettererWorkerModule = WorkerRequireModule<typeof import('./run-worker')>;
export type BettererWorker = WorkerRequireModuleAsync<BettererWorkerModule>;
