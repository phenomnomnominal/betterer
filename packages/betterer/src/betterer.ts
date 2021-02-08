import { debug } from '@phenomnomnominal/debug';

import {
  BettererConfigPartial,
  BettererBaseConfigPartial,
  BettererStartConfigPartial,
  BettererWatchConfigPartial,
  createConfig
} from './config';
import { BettererContextΩ, BettererSummary } from './context';
import { registerExtensions } from './register';
import { DEFAULT_REPORTER, WATCH_REPORTER, loadReporters } from './reporters';
import { parallel, serial } from './runner';
import { BettererWatcher, BettererWatcherΩ } from './watcher';

export function betterer(partialConfig: BettererStartConfigPartial = {}): Promise<BettererSummary> {
  initDebug();
  return runContext(
    async (context) => {
      const summary = await serial(context);
      await context.end();
      await context.save();
      return summary;
    },
    [DEFAULT_REPORTER],
    partialConfig
  );
}

export async function file(filePath: string, partialConfig?: BettererBaseConfigPartial): Promise<BettererSummary> {
  initDebug();
  return runContext(
    async (context) => {
      const summary = await parallel(context, [filePath]);
      await context.end();
      return summary;
    },
    [],
    partialConfig
  );
}
betterer.file = file;

export function watch(partialConfig?: BettererWatchConfigPartial): Promise<BettererWatcher> {
  initDebug();
  return runContext(
    async (context) => {
      const watcher = new BettererWatcherΩ(context, async (filePaths) => {
        return parallel(context, filePaths);
      });
      await watcher.setup();
      return watcher;
    },
    [WATCH_REPORTER],
    partialConfig
  );
}
betterer.watch = watch;

async function runContext<RunResult, RunFunction extends (context: BettererContextΩ) => Promise<RunResult>>(
  run: RunFunction,
  defaultReporters: Array<string>,
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

  let config = null;
  let reporter = loadReporters(defaultReporters);
  try {
    config = await createConfig(partialConfig);
    registerExtensions(config);
    if (config.silent) {
      reporter = loadReporters([]);
    }
    if (config.reporters.length > 0) {
      reporter = loadReporters(config.reporters);
    }
  } catch (error) {
    await reporter.configError(partialConfig, error);
    throw error;
  }

  const context = new BettererContextΩ(config, reporter);

  try {
    await context.start();
    return await run(context);
  } catch (error) {
    await context.error(error);
    throw error;
  }
}

function initDebug(): void {
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
