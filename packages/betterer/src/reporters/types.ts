import type { BettererError } from '@betterer/errors';

import type { BettererContext, BettererContextSummary } from '../context/index.js';
import type { BettererRun, BettererRunSummary } from '../run/index.js';
import type { BettererSuiteSummary, BettererSuite } from '../suite/index.js';

/**
 * @public The interface for hooking into **Betterer**'s reporter system.
 *
 * @remarks There are two ways to specify a custom `BettererReporter`:
 *
 * Defining the reporter _inline_ when calling `Betterer` via one of the {@link @betterer/betterer#(betterer:function) | JS APIs}:
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * betterer({
 *   reporters: [{
 *     configError() {
 *       // custom configError hook
 *     }
 *   }]
 * })
 * ```
 *
 * Defining the reporter in an npm module and passing the name to the package:
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * betterer({
 *   reporters: ['my-custom-reporter']
 * })
 * ```
 *
 * `'my-custom-module'` should export a `reporter` which implements the `BettererReporter` interface.
 */
export interface BettererReporter {
  /**
   * The `configError()` hook is called when there is an error while instantiating and validating
   * the {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
   *
   * @param config - The invalid config object.
   * @param error - The error thrown while instantiating and validating the {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
   */
  configError?(config: unknown, error: BettererError): Promise<void> | void;
  /**
   * The `contextStart()` hook is called when a {@link @betterer/betterer#BettererContext | `BettererContext`}
   * starts. The `lifecycle` promise will resolve when the context ends or reject when the context
   * throws an error, so it can be used instead of the {@link @betterer/betterer#BettererReporter.contextEnd | `BettererReporter.contextEnd()`}
   * and {@link @betterer/betterer#BettererReporter.contextError | `BettererReporter.contextError()`} hooks.
   *
   * @param context - The test context.
   * @param lifecycle - A promise that resolves when the context ends and rejects when the context throws.
   */
  contextStart?(context: BettererContext, lifecycle: Promise<BettererContextSummary>): Promise<void> | void;
  /**
   * The `contextEnd()` hook is called when a {@link @betterer/betterer#BettererContext | `BettererContext`}
   * ends.
   *
   * @param contextSummary - The test context summary.
   */
  contextEnd?(contextSummary: BettererContextSummary): Promise<void> | void;
  /**
   * The `contextError()` hook is called when a {@link @betterer/betterer#BettererContext | `BettererContext`}
   * throw an error.
   *
   * @param context - The test context.
   * @param error - The error thrown while running the context.
   */
  contextError?(context: BettererContext, error: BettererError): Promise<void> | void;
  /**
   * The `suiteStart()` hook is called when a {@link @betterer/betterer#BettererSuite | `BettererSuite`}
   * run starts. The `lifecycle` promise will resolve when the suite run ends or reject when the
   * suite run throws an error, so it can be used instead of the {@link @betterer/betterer#BettererReporter.suiteEnd | `BettererReporter.suiteEnd()`}
   * and {@link @betterer/betterer#BettererReporter.suiteError | `BettererReporter.suiteError()`}
   * hooks.
   *
   * @param suite - The {@link @betterer/betterer#BettererSuite | `BettererSuite`}.
   * @param lifecycle - A promise that resolves when the suite run ends and rejects when the suite run throws.
   */
  suiteStart?(suite: BettererSuite, lifecycle: Promise<BettererSuiteSummary>): Promise<void> | void;
  /**
   * The `suiteEnd()` hook is called when a {@link @betterer/betterer#BettererSuite | `BettererSuite`}
   * run ends.
   *
   * @param suiteSummary - A {@link @betterer/betterer#BettererSuiteSummaries | `BettererSuiteSummaries` }
   * for the completed suite run.
   */
  suiteEnd?(suiteSummary: BettererSuiteSummary): Promise<void> | void;
  /**
   * The `suiteError()` hook is called when a {@link @betterer/betterer#BettererSuite | `BettererSuite`}
   * run throws an error.
   *
   * @param suite - The test suite.
   * @param error - The error thrown while running the suite.
   */
  suiteError?(suite: BettererSuite, error: BettererError): Promise<void> | void;
  /**
   * The `runStart()` hook is called when a {@link @betterer/betterer#BettererRun | `BettererRun`}
   * starts. The `lifecycle` promise will resolve when the run ends and reject when the run throws
   * an error, so it can be used instead of the {@link @betterer/betterer#BettererReporter.runEnd | `BettererReporter.runEnd()`}
   * and {@link @betterer/betterer#BettererReporter.runError | `BettererReporter.runError()`} hooks.
   *
   * @param run - The test run.
   * @param lifecycle - A promise that resolves when the test run ends and rejects when the test run throws.
   */
  runStart?(run: BettererRun, lifecycle: Promise<BettererRunSummary>): Promise<void> | void;
  /**
   * The `runEnd()` hook is called when a {@link @betterer/betterer#BettererRun | `BettererRun`}
   * ends.
   *
   * @param runSummary - A {@link @betterer/betterer#BettererRunSummary | `BettererRunSummary` }
   * for the completed test run.
   */
  runEnd?(runSummary: BettererRunSummary): Promise<void> | void;
  /**
   * The `runError()` hook is called when a {@link @betterer/betterer#BettererRun | `BettererRun`}
   * throws an error.
   *
   * @param run - The test run.
   * @param error - The error thrown while running the test.
   */
  runError?(run: BettererRun, error: BettererError): Promise<void> | void;
}

export interface BettererReporterModule {
  reporter: BettererReporter;
}

export interface BettererReporterFactory {
  createReporter__: () => BettererReporter;
}
