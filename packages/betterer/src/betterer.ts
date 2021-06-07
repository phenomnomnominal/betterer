import { debug } from '@phenomnomnominal/debug';

import { BettererOptionsRunner, BettererOptionsStart, BettererOptionsWatch } from './config';
import { BettererSummary } from './context';
import { createGlobals } from './globals';
import { BettererRunner, BettererRunnerΩ, BettererWatcherΩ } from './runner';

export async function betterer(options: BettererOptionsStart = {}): Promise<BettererSummary> {
  initDebug();
  const [config, reporter, versionControl] = await createGlobals(options);
  const runner = new BettererRunnerΩ(config, reporter, versionControl);
  return runner.run(config.filePaths);
}

export async function runner(options: BettererOptionsRunner = {}): Promise<BettererRunner> {
  initDebug();
  const [config, reporter, versionControl] = await createGlobals(options);
  return new BettererRunnerΩ(config, reporter, versionControl);
}
betterer.runner = runner;

export async function watch(options: BettererOptionsWatch = {}): Promise<BettererRunner> {
  initDebug();
  const [config, reporter, versionControl] = await createGlobals({ ...options, watch: true });
  const watcher = new BettererWatcherΩ(config, reporter, versionControl);
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
