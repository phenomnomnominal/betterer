import { logo } from '@betterer/logger';

import { BettererConfig } from './config';
import { registerExtensions } from './register';
import { run, BettererStats } from './runner';

export * from './config';
export * from './context';
export * from './constants';
export * from './files';
export * from './runner';

registerExtensions();

export async function betterer(config: BettererConfig): Promise<BettererStats> {
  logo();
  const result = await run(config);
  return result.stats;
}
