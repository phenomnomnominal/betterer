import { BettererConfig } from './config';
import { BettererContext, BettererStats } from './context';
import { registerExtensions } from './register';
import { parallel, serial } from './runner';
import { watch } from './watcher';
import { parallelReporters, serialReporters } from './reporters';

export * from './context';
export * from './constants';
export * from './files';
export * from './runner';

registerExtensions();

export async function betterer(config: BettererConfig): Promise<BettererStats> {
  const context = await BettererContext.create(config, serialReporters);
  await serial(context);
  return await context.complete();
}

export async function bettererWatch(
  config: BettererConfig
): Promise<() => Promise<BettererStats>> {
  const context = await BettererContext.create(config, parallelReporters);
  await parallel(context);
  const watcher = watch(context, itemPath => {
    context.setFiles([itemPath]);
    parallel(context);
  });
  return async function(): Promise<BettererStats> {
    watcher.close();
    return await context.complete();
  };
}
