import { debug } from '@phenomnomnominal/debug';

import { BettererOptionsRunner, BettererOptionsStart, BettererOptionsWatch } from './config';
import { BettererSummary } from './context';
import { BettererRunner, BettererRunnerΩ, BettererWatcherΩ } from './runner';

export async function betterer(options: BettererOptionsStart = {}): Promise<BettererSummary> {
  initDebug();
  const runner = new BettererRunnerΩ();
  await runner.start(options);
  await runner.queue();
  return runner.stop();
}

export async function runner(options: BettererOptionsRunner = {}): Promise<BettererRunner> {
  initDebug();
  const runner = new BettererRunnerΩ();
  await runner.start(options);
  return runner;
}
betterer.runner = runner;

export async function watch(options: BettererOptionsWatch = {}): Promise<BettererRunner> {
  initDebug();
  options.watch = true;
  const runner = new BettererRunnerΩ();
  const context = await runner.start(options);
  const watcher = new BettererWatcherΩ(context, runner);
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
