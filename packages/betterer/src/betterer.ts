import { debug } from '@phenomnomnominal/debug';

import {
  BettererOptionsRunner,
  BettererOptionsStart,
  BettererOptionsResults,
  BettererOptionsWatch,
  BettererOptionsMerge
} from './config';
import { BettererRunner, BettererRunnerΩ } from './runner';
import { BettererMergerΩ, BettererResultsSummary, BettererResultsSummaryΩ } from './results';
import { BettererSuiteSummary } from './suite';

/**
 * @public Run **Betterer** with the given options.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * const suiteSummary = await betterer(options);
 * ```
 *
 * @param options - Options for running **Betterer**.
 * @throws {@link @betterer/errors#BettererError | `BettererError` }
 * Will throw if something goes wrong while running **Betterer**.
 */
export async function betterer(options: BettererOptionsStart = {}): Promise<BettererSuiteSummary> {
  initDebug();
  const runner = await BettererRunnerΩ.create(options);
  return await runner.run();
}

/**
 * @public Resolve any merge conflicts in the specified results file.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * await betterer.merge(options);
 * ```
 *
 * @param options - Options for merging conflicts in the results file.
 * @throws {@link @betterer/errors#BettererError | `BettererError` }
 * Will throw if something goes wrong while merging conflicts in the results file.
 */
export async function merge(options: BettererOptionsMerge = {}): Promise<void> {
  const merger = await BettererMergerΩ.create(options);
  return await merger.merge();
}
betterer.merge = merge;

/**
 * @public Get a summary of the results of the defined {@link @betterer/betterer#BettererTest | `BettererTest`s}.
 *
 * **Betterer** will read the {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file }
 * and the {@link https://phenomnomnominal.github.io/betterer/docs/results-file | results file} and return a summary of the results.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * const resultsSummary = await betterer.results(options);
 * ```
 *
 * @param options - Options for getting the summary of the results.
 * @throws {@link @betterer/errors#BettererError | `BettererError` }
 * Will throw if something goes wrong while getting the summary of the results.
 */
export function results(options: BettererOptionsResults = {}): Promise<BettererResultsSummary> {
  initDebug();
  return BettererResultsSummaryΩ.create(options);
}
betterer.results = results;

/**
 * @public Create a **BettererRunner** with the given options.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * const runner = await betterer.runner(options);
 * ```
 *
 * @param options - Options for creating the runner.
 * @throws {@link @betterer/errors#BettererError | `BettererError` }
 * Will throw if something goes wrong while creating the runner.
 */
export function runner(options: BettererOptionsRunner = {}): Promise<BettererRunner> {
  initDebug();
  return BettererRunnerΩ.create(options);
}
betterer.runner = runner;

/**
 * @public Create a **BettererRunner** with the given options. Also starts up a file watcher
 * for tracked files in the current working directory.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * const runner = await betterer.watch(options);
 * ```
 *
 * @param options - Options for creating the runner.
 * @throws {@link @betterer/errors#BettererError | `BettererError` }
 * Will throw if something goes wrong while creating the runner or watcher.
 */
export function watch(options: BettererOptionsWatch = {}): Promise<BettererRunner> {
  initDebug();
  return BettererRunnerΩ.create({ ...options, watch: true });
}
betterer.watch = watch;

function initDebug(): void {
  const enabled = !!process.env.BETTERER_DEBUG;
  if (enabled) {
    debug({
      header: 'betterer',
      include: [/@betterer\//],
      ignore: [require.resolve('./utils'), require.resolve('./register')],
      enabled,
      time: !!process.env.BETTERER_DEBUG_TIME,
      values: !!process.env.BETTERER_DEBUG_VALUES,
      logPath: process.env.BETTERER_DEBUG_LOG
    });
  }
}
