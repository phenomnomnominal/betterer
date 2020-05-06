import { logError } from '@betterer/errors';
import { BettererConfigPartial, createConfig } from './config';
import { BettererContext, BettererStats, BettererRuns } from './context';
import { registerExtensions } from './register';
import { parallelReporters, serialReporters } from './reporters';
import { parallel, serial } from './runner';
import { isBoolean, isString } from './utils';
import { watch } from './watcher';

export * from './config/public';
export * from './context/public';
export * from './reporters/public';
export * from './results/public';
export * from './test/public';
export * from './watcher/public';

registerExtensions();

export async function betterer(config: BettererConfigPartial): Promise<BettererStats>;
export async function betterer(config: BettererConfigPartial, watchMode: boolean): Promise<() => void>;
export async function betterer(config: BettererConfigPartial, filePath: string): Promise<BettererRuns>;
export async function betterer(
  config: BettererConfigPartial,
  watchModeOrFilePath?: boolean | string
): Promise<BettererStats | BettererRuns | (() => void)> {
  try {
    const finalConfig = createConfig(config);

    if (isString(watchModeOrFilePath)) {
      const filePath = watchModeOrFilePath;
      const context = await BettererContext.create(finalConfig);
      return parallel(context, [filePath]);
    }

    if (isBoolean(watchModeOrFilePath)) {
      const context = await BettererContext.create(finalConfig, parallelReporters);
      const watcher = watch(context, filePaths => {
        parallel(context, filePaths);
      });
      return function (): void {
        watcher.close();
      };
    }

    const context = await BettererContext.create(finalConfig, serialReporters);
    const runs = await serial(context);
    return await context.process(runs);
  } catch (e) {
    logError(e);
    throw e;
  }
}
