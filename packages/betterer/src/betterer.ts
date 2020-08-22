import { logErrorΔ } from '@betterer/errors';

import { BettererConfig, BettererConfigPartial, createConfig } from './config';
import { BettererContextΩ, BettererStats, BettererRuns } from './context';
import { registerExtensions } from './register';
import { loadReporters, DEFAULT_REPORTER, WATCH_REPORTER } from './reporters';
import { parallel, serial } from './runner';
import { BettererWatcherΩ, BettererWatcher } from './watcher';

export function betterer(partialConfig: BettererConfigPartial = {}): Promise<BettererStats> {
  return runContext(partialConfig, async (config) => {
    const reporter = loadReporters(config.reporters.length ? config.reporters : [DEFAULT_REPORTER]);
    const context = new BettererContextΩ(config, reporter);
    await context.setup();
    const runs = await serial(context);
    const stats = await context.process(runs);
    context.tearDown();
    return stats;
  });
}

betterer.single = async function bettererSingle(
  partialConfig: BettererConfigPartial = {},
  filePath: string
): Promise<BettererRuns> {
  return runContext(partialConfig, async (config) => {
    const context = new BettererContextΩ(config);
    await context.setup();
    const runs = await parallel(context, [filePath]);
    context.tearDown();
    return runs;
  });
};

betterer.watch = function bettererWatch(partialConfig: BettererConfigPartial = {}): Promise<BettererWatcher> {
  return runContext(partialConfig, async (config) => {
    const reporter = loadReporters(config.reporters.length ? config.reporters : [WATCH_REPORTER]);
    const context = new BettererContextΩ(config, reporter);
    const watcher = new BettererWatcherΩ(context, async (filePaths) => {
      await context.setup();
      return parallel(context, filePaths);
    });
    await watcher.setup();
    return watcher;
  });
};

async function runContext<RunResult, RunFunction extends (config: BettererConfig) => Promise<RunResult>>(
  partialConfig: BettererConfigPartial,
  run: RunFunction
): Promise<RunResult> {
  try {
    const config = createConfig(partialConfig);
    registerExtensions(config);
    return await run(config);
  } catch (e) {
    logErrorΔ(e);
    throw e;
  }
}
