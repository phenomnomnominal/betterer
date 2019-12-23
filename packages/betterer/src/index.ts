import { logo } from '@betterer/logger';

import { BettererConfig, BettererStats, prepare } from './context';
import { registerExtensions } from './register';
import { runTests } from './runner';
import { process } from './reporter';

export * from './context';
export * from './constants';
export * from './files';
export * from './runner';

registerExtensions();

export async function betterer(config: BettererConfig): Promise<BettererStats> {
  logo();
  const context = await prepare(config);
  await runTests(context);
  const result = await process(context);
  return result.stats;
}
