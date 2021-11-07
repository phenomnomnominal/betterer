import { BettererFilePaths } from '../fs';
import { BettererRuns, BettererRunSummaries } from '../run';
import { BettererTestNames } from '../test';

/**
 * @public A set of {@link @betterer/betterer#BettererTest | `BettererTest`} runs. Will become a
 * {@link @betterer/betterer#BettererSuiteSummary | `BettererSuiteSummary`} when the test suite is
 * completed.
 */
export type BettererSuite = {
  /**
   * An array of file paths that will be tested. The file paths can be specified by the global {@link @betterer/betterer#BettererConfigStart.includes | `includes` }
   * and {@link @betterer/betterer#BettererConfigStart.excludes | `excludes`} properties. Also used by
   * watch mode to target individual files.
   */
  readonly filePaths: BettererFilePaths;
  /**
   * An array containing a {@link @betterer/betterer#BettererRun | `BettererRun`}
   * for each test in the {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}.
   */
  readonly runs: BettererRuns;
};

/**
 * @public The summary of a {@link @betterer/betterer#BettererSuite | `BettererSuite`} suite. Includes
 * everything from {@link @betterer/betterer#BettererSuite | `BettererSuite`}.
 *
 * You can get the `BettererSuiteSummary` via the {@link @betterer/betterer#BettererReporter | `BettererReporter` }
 * interface.
 *
 * @example
 * ```typescript
 * const myReporter: BettererReporter = {
 *   // Access the summary after the suite has ended:
 *   suiteEnd (suiteSummary: BettererSuiteSummary) {
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
 *   // Access the summary after the suite has ended:
 *   suiteStart (suite: BettererSuite, lifecycle: Promise<BettererSuiteSummary>) {
 *     const summary: BettererSuiteSummary = await lifecycle;
 *     // ...
 *   }
 * }
 * ```
 */
export type BettererSuiteSummary = BettererSuite & {
  /**
   * An array containing a {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`}
   * for each test in the {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}.
   */
  readonly runSummaries: BettererRunSummaries;
  /**
   * An array of the names of tests that have changed since they were previously run. This includes
   * tests that were deleted, tests that are new, tests that got better or worse, and tests that
   * stayed the same (but still changed in some way).
   */
  readonly changed: BettererTestNames;

  /**
   * An array containing a {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`}
   * for each test that got better.
   */
  readonly better: BettererRunSummaries;
  /**
   * An array containing a {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`}
   * for each test that met its goal.
   */
  readonly completed: BettererRunSummaries;
  /**
   * An array containing a {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`}
   * for each test that has expired.
   */
  readonly expired: BettererRunSummaries;
  /**
   * An array containing a {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`}
   * for each test that failed.
   */
  readonly failed: BettererRunSummaries;
  /**
   * An array containing a {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`}
   * for each test that was run for the first time.
   */
  readonly new: BettererRunSummaries;
  /**
   * An array containing a {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`}
   * for each test that didn't fail and wasn't skipped.
   */
  readonly ran: BettererRunSummaries;
  /**
   * An array containing a {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`}
   * for each test that stayed the same.
   */
  readonly same: BettererRunSummaries;
  /**
   * An array containing a {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`}
   * for each test that was skipped.
   */
  readonly skipped: BettererRunSummaries;
  /**
   * An array containing a {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`}
   * for each test that got worse, but the `--update` flag was enabled.
   */
  readonly updated: BettererRunSummaries;
  /**
   * An array containing a {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary`}
   * for each test that got worse.
   */
  readonly worse: BettererRunSummaries;
};

/**
 * @public An array of {@link @betterer/betterer#BettererSuiteSummary | `BettererSuiteSummaries`}.
 */
export type BettererSuiteSummaries = ReadonlyArray<BettererSuiteSummary>;
