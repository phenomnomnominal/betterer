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

export async function betterer(options: BettererOptionsStart = {}): Promise<BettererSuiteSummary> {
  initDebug();
  const runner = await BettererRunnerΩ.create(options);
  return runner.run();
}

/**
 * @public resolve any merge conflicts in the specified results file.
 */
export async function merge(options: BettererOptionsMerge = {}): Promise<void> {
  const merger = BettererMergerΩ.create(options);
  return merger.merge();
}
betterer.merge = merge;

export function results(options: BettererOptionsResults = {}): Promise<BettererResultsSummary> {
  initDebug();
  return BettererResultsSummaryΩ.create(options);
}
betterer.results = results;

export function runner(options: BettererOptionsRunner = {}): Promise<BettererRunner> {
  initDebug();
  return BettererRunnerΩ.create(options);
}
betterer.runner = runner;

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
