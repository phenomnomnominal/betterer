import { logErrorΔ } from '@betterer/errors';

import { BettererConfig, BettererConfigPartial, createConfig } from './config';
import { BettererContextΩ, BettererSummary } from './context';
import { registerExtensions } from './register';
import { DEFAULT_REPORTER, WATCH_REPORTER, loadReporters } from './reporters';
import { parallel, serial } from './runner';
import { BettererWatcher, BettererWatcherΩ } from './watcher';

export function betterer(partialConfig?: BettererConfigPartial): Promise<BettererSummary> {
  return runContext(async (config) => {
    const reporter = loadReporters(config.reporters.length ? config.reporters : [DEFAULT_REPORTER]);
    const context = new BettererContextΩ(config, reporter);
    try {
      await context.setup();
      const summary = await serial(context);
      context.end();
      await context.save();
      return summary;
    } catch (error) {
      reporter.contextError(context, error);
      throw error;
    }
  }, partialConfig);
}

export async function file(filePath: string, partialConfig?: BettererConfigPartial): Promise<BettererSummary> {
  return runContext(async (config) => {
    const context = new BettererContextΩ(config);
    await context.setup();
    const summary = await parallel(context, [filePath]);
    context.end();
    return summary;
  }, partialConfig);
}
betterer.file = file;

export function watch(partialConfig?: BettererConfigPartial): Promise<BettererWatcher> {
  return runContext(async (config) => {
    const reporter = loadReporters(config.reporters.length ? config.reporters : [WATCH_REPORTER]);
    const context = new BettererContextΩ(config, reporter);
    try {
      const watcher = new BettererWatcherΩ(context, async (filePaths) => {
        await context.setup();
        return parallel(context, filePaths);
      });
      await watcher.setup();
      return watcher;
    } catch (error) {
      reporter.contextError(context, error);
      throw error;
    }
  }, partialConfig);
}
betterer.watch = watch;

async function runContext<RunResult, RunFunction extends (config: BettererConfig) => Promise<RunResult>>(
  run: RunFunction,
  partialConfig: BettererConfigPartial = {}
): Promise<RunResult> {
  try {
    const config = createConfig(partialConfig);
    registerExtensions(config);
    return await run(config);
  } catch (error) {
    logErrorΔ(error);
    throw error;
  }
}
