import {
  BettererConfigPartial,
  BettererBaseConfigPartial,
  BettererStartConfigPartial,
  BettererWatchConfigPartial,
  createConfig
} from './config';
import { BettererContextΩ, BettererSummary } from './context';
import { BettererDebugOptions, debug } from './debug';
import { registerExtensions } from './register';
import { DEFAULT_REPORTER, WATCH_REPORTER, loadReporters, BettererReporterNames } from './reporters';
import { parallel, serial } from './runner';
import { BettererWatcher, BettererWatcherΩ } from './watcher';

const DEBUG_OPTIONS: BettererDebugOptions = {
  header: 'betterer',
  include: [/@betterer\//],
  ignore: [new RegExp(require.resolve('./utils'))]
};

export function betterer(partialConfig: BettererStartConfigPartial = {}): Promise<BettererSummary> {
  return runContext(
    async (context) => {
      await context.setup();
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
  return runContext(
    async (context) => {
      await context.setup();
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
  return runContext(
    async (context) => {
      const watcher = new BettererWatcherΩ(context, async (filePaths) => {
        await context.setup();
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
  defaultReporters: BettererReporterNames,
  partialConfig: BettererConfigPartial = {}
): Promise<RunResult> {
  debug(DEBUG_OPTIONS);

  let config = null;
  let reporter = loadReporters(defaultReporters);
  try {
    config = await createConfig(partialConfig);
    registerExtensions(config);
    if (config.reporters.length) {
      reporter = loadReporters(config.reporters);
    }
  } catch (error) {
    await reporter.configError(partialConfig, error);
    throw error;
  }

  const context = new BettererContextΩ(config, reporter);

  try {
    await reporter.contextStart(context);
    return await run(context);
  } catch (error) {
    await reporter.contextError(context, error);
    throw error;
  }
}
