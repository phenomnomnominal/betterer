import { debug } from '@phenomnomnominal/debug';

import { BettererOptionsRunner, BettererOptionsStart, BettererOptionsWatch } from './config';
import { BettererRunner, BettererRunnerΩ, BettererWatcherΩ } from './runner';
import { BettererSuiteSummary } from './suite';

export async function betterer(options: BettererOptionsStart = {}): Promise<BettererSuiteSummary> {
  initDebug();
  const runner = await BettererRunnerΩ.create(options);
  return runner.run(runner.config.filePaths);
}

export async function runner(options: BettererOptionsRunner = {}): Promise<BettererRunner> {
  initDebug();
  return BettererRunnerΩ.create(options);
}
betterer.runner = runner;

export async function watch(options: BettererOptionsWatch = {}): Promise<BettererRunner> {
  initDebug();
  return BettererWatcherΩ.create({ ...options, watch: true });
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
