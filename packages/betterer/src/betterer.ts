import { debug } from '@phenomnomnominal/debug';

import { BettererOptionsRunner, BettererOptionsStart, BettererOptionsWatch } from './config';
import { BettererSummary } from './context';
import { createGlobals } from './globals';
import { BettererRunner, BettererRunnerΩ, BettererWatcherΩ } from './runner';

export async function betterer(options: BettererOptionsStart = {}): Promise<BettererSummary> {
  initDebug();
  const globals = await createGlobals(options);
  const runner = new BettererRunnerΩ(globals);
  return runner.run(globals.config.filePaths);
}

export async function runner(options: BettererOptionsRunner = {}): Promise<BettererRunner> {
  initDebug();
  return new BettererRunnerΩ(await createGlobals(options));
}
betterer.runner = runner;

export async function watch(options: BettererOptionsWatch = {}): Promise<BettererRunner> {
  initDebug();
  const watcher = new BettererWatcherΩ(await createGlobals({ ...options, watch: true }));
  await watcher.setup();
  return watcher;
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
