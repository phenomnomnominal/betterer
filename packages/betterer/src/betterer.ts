import { debug } from '@phenomnomnominal/debug';

import { BettererBaseConfigPartial, BettererStartConfigPartial, BettererWatchConfigPartial } from './config';
import { BettererSummary } from './context';
import { BettererRunner, BettererRunnerΩ, BettererWatcherΩ } from './runner';

export async function betterer(partialConfig: BettererStartConfigPartial = {}): Promise<BettererSummary> {
  initDebug();
  const runner = new BettererRunnerΩ();
  await runner.start(partialConfig);
  await runner.queue();
  return runner.stop();
}

export async function runner(partialConfig?: BettererBaseConfigPartial): Promise<BettererRunner> {
  initDebug();
  const runner = new BettererRunnerΩ();
  await runner.start(partialConfig);
  return runner;
}
betterer.runner = runner;

export async function watch(partialConfig: BettererWatchConfigPartial = {}): Promise<BettererRunner> {
  initDebug();
  partialConfig.watch = true;
  const runner = new BettererRunnerΩ();
  const context = await runner.start(partialConfig);
  const watcher = new BettererWatcherΩ(context, runner);
  await watcher.setup();
  return watcher;
}
betterer.watch = watch;

function initDebug() {
  const enabled = !!process.env.BETTERER_DEBUG;
  if (enabled) {
    debug({
      header: 'betterer',
      include: [/@betterer\//],
      ignore: [require.resolve('./utils')],
      enabled,
      time: !!process.env.BETTERER_DEBUG_TIME,
      values: !!process.env.BETTERER_DEBUG_VALUES,
      logPath: process.env.BETTERER_DEBUG_LOG
    });
  }
}
