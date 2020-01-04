import { logError } from '@betterer/errors';
import { BettererConfig } from './config/types';
import { BettererContext, BettererStats } from './context';
import { registerExtensions } from './register';
import { parallel, serial } from './runner';
import { watch } from './watcher';
import { parallelReporters, serialReporters } from './reporters';

// Export constructors and creators:
export { Betterer, createBetterer } from './betterer';
export {
  BettererContext,
  BettererRun,
  BettererTest,
  BettererStats
} from './context';
export { FileBetterer, createFileBetterer } from './files';

// Export all types:
export * from './betterer/types';
export * from './config/types';
export * from './context/types';
export * from './files/types';

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

export async function bettererWatch(
  config: BettererConfig
): Promise<() => void> {
  try {
    const context = await BettererContext.create(config, parallelReporters);
    const watcher = watch(context, itemPath => {
      parallel(context, [itemPath]);
    });
    return function(): void {
      watcher.close();
    };
  } catch (e) {
    logError(e);
    throw e;
  }
}
