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
 * @public run **Betterer** with the given options.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * const suiteSummary = await betterer(options);
 * ```
 */
export async function betterer(options: BettererOptionsStart = {}): Promise<BettererSuiteSummary> {
  initDebug();
  const runner = await BettererRunnerΩ.create(options);
  return runner.run();
}

/**
 * @public resolve any merge conflicts in the specified results file.
 */
export async function merge(options: BettererOptionsMerge = {}): Promise<void> {
  const merger = await BettererMergerΩ.create(options);
  return merger.merge();
}
betterer.merge = merge;

/**
 * * @public get a summary of the current **Betterer** results.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * const resultsSummary = await betterer.results(options);
 * ```
 */
export function results(options: BettererOptionsResults = {}): Promise<BettererResultsSummary> {
  initDebug();
  return BettererResultsSummaryΩ.create(options);
}
betterer.results = results;

/**
 * @public create a **BettererRunner** with the given options.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * const runner = await betterer.runner(options);
 * ```
 */
export function runner(options: BettererOptionsRunner = {}): Promise<BettererRunner> {
  initDebug();
  return BettererRunnerΩ.create(options);
}
betterer.runner = runner;

/**
 * @public create a **BettererRunner** with the given options. Also starts up a file watcher
 * for tracked files in the current directory.
 *
 * @example
 * ```typescript
 * import { betterer } from '@betterer/betterer';
 *
 * const runner = await betterer.runner(options);
 * ```
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
