import { debug } from '@phenomnomnominal/debug';

import { BettererConfigPartial, BettererStartConfigPartial, BettererWatchConfigPartial, createConfig } from './config';
import { BettererContextΩ, BettererSummary } from './context';
import { registerExtensions } from './register';
import { DEFAULT_REPORTER, WATCH_REPORTER, loadReporters } from './reporters';
import { runTests } from './runner';
import { BettererFilePaths, BettererWatcher, BettererWatcherΩ } from './watcher';

export function betterer(
  partialConfig?: BettererStartConfigPartial,
  filePaths?: BettererFilePaths
): Promise<BettererSummary>;
export function betterer(partialConfig?: BettererWatchConfigPartial): Promise<BettererWatcher>;
export function betterer(
  partialConfig: BettererConfigPartial = {},
  filePaths: BettererFilePaths = []
): Promise<BettererSummary | BettererWatcher> {
  if (partialConfig.watch) {
    return runContext(async (context) => {
      const watcher = new BettererWatcherΩ(context, async (filePaths) => {
        return runTests(context, filePaths);
      });
      await watcher.setup();
      return watcher;
    }, partialConfig);
  }
  return runContext(async (context) => {
    const summary = await runTests(context, filePaths);
    await context.end();
    await context.save();
    return summary;
  }, partialConfig);
}

async function runContext<RunResult, RunFunction extends (context: BettererContextΩ) => Promise<RunResult>>(
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

  let config = null;
  const reporterName = partialConfig.watch ? WATCH_REPORTER : DEFAULT_REPORTER;
  let reporter = loadReporters([reporterName]);
  try {
    config = await createConfig(partialConfig);
    registerExtensions(config);
    if (config.silent) {
      reporter = loadReporters([]);
    } else if (config.reporters.length > 0) {
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
