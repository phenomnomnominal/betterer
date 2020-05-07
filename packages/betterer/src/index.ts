import { logError } from '@betterer/errors';
import { BettererConfigPartial, createConfig } from './config';
import { BettererContext, BettererStats, BettererRuns } from './context';
import { registerExtensions } from './register';
import { parallelReporters, serialReporters } from './reporters';
import { parallel, serial } from './runner';
import { isBoolean, isString } from './utils';
import { watch, BettererWatchStop } from './watcher';

export * from './config/public';
export * from './context/public';
export * from './reporters/public';
export * from './results/public';
export * from './test/public';
export * from './watcher/public';

registerExtensions();

export async function betterer(config: BettererConfigPartial): Promise<BettererStats>;
export async function betterer(config: BettererConfigPartial, watchMode: boolean): Promise<BettererWatchStop>;
export async function betterer(config: BettererConfigPartial, filePath: string): Promise<BettererRuns>;
export async function betterer(
  config: BettererConfigPartial,
  watchModeOrFilePath?: boolean | string
): Promise<BettererStats | BettererRuns | BettererWatchStop> {
  try {
    const finalConfig = createConfig(config);

    if (isString(watchModeOrFilePath)) {
      const filePath = watchModeOrFilePath;
      const context = await BettererContext.create(finalConfig);
      return parallel(context, [filePath]);
    }

    if (isBoolean(watchModeOrFilePath)) {
      let context: BettererContext;
      let running: Promise<BettererRuns>;
      const watcher = await watch(finalConfig, async (filePaths) => {
        context = await BettererContext.create(finalConfig, parallelReporters);
        running = parallel(context, filePaths);
      });
      return async function (): Promise<void> {
        await watcher.close();
        await context?.process(await running);
      };
    }

    const context = await BettererContext.create(finalConfig, serialReporters);
    return await context.process(await serial(context));
  } catch (e) {
    logError(e);
    throw e;
  }
}
