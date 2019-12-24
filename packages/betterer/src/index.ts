import { logo } from '@betterer/logger';

import { BettererConfig, BettererStats, prepare } from './context';
import { registerExtensions } from './register';
import { runTests } from './runner';
import { report } from './reporter';
import { watch } from './watcher';

export * from './context';
export * from './constants';
export * from './files';
export * from './runner';

registerExtensions();

export async function betterer(config: BettererConfig): Promise<BettererStats> {
  logo();
  const context = await prepare(config);
  await runTests(context);
  const result = await report(context);
  return result.stats;
}

export async function bettererWatch(
  config: BettererConfig
): Promise<BettererStats> {
  logo();
  const context = await prepare(config);
  await runTests(context);
  const watcher = watch(context, itemPath => {
    context.files = [itemPath];
    runTests(context);
  });
  return new Promise((resolve): void => {
    process.on('SIGINT', () => {
      watcher.close();
      resolve(context.stats);
      process.exit();
    });
  });
}
