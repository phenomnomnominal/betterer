import { logError } from '@betterer/errors';
import { BettererConfigPartial } from './config';
import { BettererContext, BettererStats, BettererRuns } from './context';
import { registerExtensions } from './register';
import { parallelReporters, serialReporters } from './reporters';
import { parallel, serial } from './runner';
import { BettererWatcher } from './watcher';

export * from './config/public';
export * from './context/public';
export * from './reporters/public';
export * from './results/public';
export * from './test/public';
export * from './watcher/public';

registerExtensions();

export async function betterer(config: BettererConfigPartial = {}): Promise<BettererStats> {
  try {
    const context = new BettererContext(config, serialReporters);
    await context.setup();
    const runs = await serial(context);
    const stats = await context.process(runs);
    context.tearDown();
    return stats;
  } catch (e) {
    logError(e);
    throw e;
  }
}

betterer.single = async function bettererSingle(
  config: BettererConfigPartial = {},
  filePath: string
): Promise<BettererRuns> {
  try {
    const context = new BettererContext(config);
    await context.setup();
    const runs = await parallel(context, [filePath]);
    context.tearDown();
    return runs;
  } catch (e) {
    logError(e);
    throw e;
  }
};

betterer.watch = async function bettererWatch(config: BettererConfigPartial = {}): Promise<BettererWatcher> {
  try {
    const context = new BettererContext(config, parallelReporters);
    const watcher = new BettererWatcher(context, async (filePaths) => {
      await context.setup();
      return parallel(context, filePaths);
    });
    await watcher.setup();
    return watcher;
  } catch (e) {
    logError(e);
    throw e;
  }
};
