import { logError } from '@betterer/errors';
import { BettererConfig } from './config/types';
import { BettererContext, BettererStats, BettererRuns } from './context';
import { registerExtensions } from './register';
import { parallel, serial } from './runner';
import { watch } from './watcher';
import { parallelReporters, serialReporters } from './reporters';

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
export * from './config/types';
export * from './context/types';

registerExtensions();

export async function betterer(config: BettererConfig): Promise<BettererStats> {
  try {
    const context = await BettererContext.create(config, serialReporters);
    const runs = await serial(context);
    return await context.complete(runs);
  } catch (e) {
    logError(e);
    throw e;
  }
}

export async function bettererWatch(config: BettererConfig): Promise<() => void> {
  try {
    const context = await BettererContext.create(config, parallelReporters);
    const watcher = watch(context, filePath => {
      parallel(context, [filePath]);
    });
    return function(): void {
      watcher.close();
    };
  } catch (e) {
    logError(e);
    throw e;
  }
}

export async function bettererFile(config: BettererConfig, filePath: string): Promise<BettererRuns> {
  try {
    const context = await BettererContext.create(config);
    return parallel(context, [filePath]);
  } catch (e) {
    logError(e);
    throw e;
  }
}
