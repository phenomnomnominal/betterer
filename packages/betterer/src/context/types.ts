import { BettererError } from '@betterer/errors';

import { BettererConfig, BettererOptionsOverride } from '../config';
import { BettererSuiteSummaries, BettererSuiteSummary } from '../suite';

/**
 * @public The context of a set of test suite runs.
 *
 * @remarks The internal implementation of `BettererContext` is responsible for a lot more than
 * this interface suggests, but we want to minimise the public API surface as much as possible.
 * You can get the `BettererContext` via the {@link @betterer/betterer#BettererReporter | `BettererReporter` }
 * interface.
 *
 * @example
 * ```typescript
 * const myReporter: BettererReporter = {
 *   // Access the context before any tests are run:
 *   contextStart (context: BettererContext) {
 *     // ...
 *   },
 *   // Access the context when something goes wrong:
 *   contextError (context: BettererContext) {
 *     // ...
 *   }
 * }
 * ```
 */
export interface BettererContext {
  /**
   * The {@link @betterer/betterer#BettererConfig | `config`} of the context. You probably don't
   * want to mess with this directly 🔥. If you need to update the config, you should use
   * {@link @betterer/betterer#BettererContext.options | `BettererContext.options()`} instead.
   */
  readonly config: BettererConfig;
  /**
   * Make changes to the context config. The updated config will be used for the next run.
   *
   * @param optionsOverride - The {@link @betterer/betterer#BettererOptionsFilters | `filters`}, {@link @betterer/betterer#BettererOptionsIgnores | `ignores`},
   * and {@link @betterer/betterer#BettererOptionsReporters | `reporters`} to use for the next run.
   */
  options(optionsOverride: BettererOptionsOverride): Promise<void>;
  /**
   * Stop the test run and clean everything up. If tests are running, waits for them to end before
   * stopping.
   */
  stop(): Promise<BettererSuiteSummary>;
}

export interface BettererContextStarted {
  end(): Promise<BettererContextSummary>;
  error(error: BettererError): Promise<void>;
}

/**
 * @public The summary of a set of test suite runs.
 *
 * @remarks You can get the `BettererContextSummary` via the {@link @betterer/betterer#BettererReporter | `BettererReporter` }
 * interface.
 *
 * @example
 * ```typescript
 * const myReporter: BettererReporter = {
 *   // Access the summary after the context has ended:
 *   contextEnd (contextSummary: BettererContextSummary) {
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
 *   // Access the summary after the context has ended:
 *   contextStart (context: BettererContext, lifecycle: Promise<BettererContextSummary>) {
 *     const summary: BettererContextSummary = await lifecycle;
 *     // ...
 *   }
 * }
 * ```
 */
export interface BettererContextSummary {
  /**
   * The {@link @betterer/betterer#BettererConfig | config} of the context.
   */
  readonly config: BettererConfig;
  /**
   * The {@link @betterer/betterer#BettererSuiteSummaries | `BettererSuiteSummaries`} for all test
   * suite runs completed by a context.
   */
  suites: BettererSuiteSummaries;
  /**
   * The {@link @betterer/betterer#BettererSuiteSummary | `BettererSuiteSummary`} for the last test
   * suite run by a context.
   */
  lastSuite: BettererSuiteSummary;
}
