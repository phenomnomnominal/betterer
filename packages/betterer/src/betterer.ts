import { logErrorΔ } from '@betterer/errors';
import { debug } from '@phenomnomnominal/debug';

import {
  BettererConfig,
  BettererConfigPartial,
  BettererStartConfigPartial,
  BettererBaseConfigPartial,
  BettererWatchConfigPartial,
  createConfig
} from './config';
import { BettererContextΩ, BettererSummary } from './context';
import { registerExtensions } from './register';
import { DEFAULT_REPORTER, WATCH_REPORTER, loadReporters } from './reporters';
import { parallel, serial } from './runner';
import { BettererWatcher, BettererWatcherΩ } from './watcher';

export function betterer(partialConfig?: BettererStartConfigPartial): Promise<BettererSummary> {
  return runContext(async (config) => {
    const reporter = loadReporters(config.reporters.length ? config.reporters : [DEFAULT_REPORTER]);
    const context = new BettererContextΩ(config, reporter);
    await reporter.contextStart(context);
    try {
      await context.setup();
      const summary = await serial(context);
      await context.end();
      await context.save();
      return summary;
    } catch (error) {
      await reporter.contextError(context, error);
      throw error;
    }
  }, partialConfig);
}

export async function file(filePath: string, partialConfig?: BettererBaseConfigPartial): Promise<BettererSummary> {
  return runContext(async (config) => {
    const context = new BettererContextΩ(config);
    await context.setup();
    const summary = await parallel(context, [filePath]);
    await context.end();
    return summary;
  }, partialConfig);
}
betterer.file = file;

export function watch(partialConfig?: BettererWatchConfigPartial): Promise<BettererWatcher> {
  return runContext(async (config) => {
    const reporter = loadReporters(config.reporters.length ? config.reporters : [WATCH_REPORTER]);
    const context = new BettererContextΩ(config, reporter);
    await reporter.contextStart(context);
    try {
      const watcher = new BettererWatcherΩ(context, async (filePaths) => {
        await context.setup();
        return parallel(context, filePaths);
      });
      await watcher.setup();
      return watcher;
    } catch (error) {
      await reporter.contextError(context, error);
      throw error;
    }
  }, partialConfig);
}
betterer.watch = watch;

async function runContext<RunResult, RunFunction extends (config: BettererConfig) => Promise<RunResult>>(
  run: RunFunction,
  partialConfig: BettererConfigPartial = {}
): Promise<RunResult> {
  debug({
    header: 'betterer',
    include: [/@betterer\//],
    ignore: [require.resolve('./utils')],
    enabled: !!process.env.DEBUG,
    time: !!process.env.DEBUG_TIME,
    values: !!process.env.DEBUG_VALUES,
    logPath: process.env.DEBUG_LOG
  });

  try {
    const config = await createConfig(partialConfig);
    registerExtensions(config);
    return await run(config);
  } catch (error) {
    logErrorΔ(error);
    throw error;
  }
}
