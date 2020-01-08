import { logError } from '@betterer/errors';
import { BettererConfigPartial, createConfig } from './config';
import { BettererContext, BettererStats, BettererRuns } from './context';
import { registerExtensions } from './register';
import { parallelReporters, serialReporters } from './reporters';
import { parallel, serial } from './runner';
import { isBoolean, isString } from './utils';
import { watch } from './watcher';

// Export constructors and creators:
export {
  Betterer,
  isBetterer,
  FileBetterer,
  isFileBetterer,
  createBetterer,
  createFileBetterer,
  BettererFiles,
  BettererFile
} from './betterer';
export { BettererContext, BettererRun, BettererTest, BettererStats } from './context';

// Export all types:
export * from './betterer/betterer/types';
export * from './betterer/file-betterer/types';
export * from './betterer/serialisable-betterer/types';
export * from './betterer/types';
export * from './config/types';
export * from './context/results/types';
export * from './context/types';

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
      const watcher = watch(context, filePath => {
        parallel(context, [filePath]);
      });
      return function(): void {
        watcher.close();
      };
    }

    const context = await BettererContext.create(finalConfig, serialReporters);
    const runs = await serial(context);
    return await context.complete(runs);
  } catch (e) {
    logError(e);
    throw e;
  }
}
