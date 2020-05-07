import { logo } from '@betterer/logger';

import { BettererConfigPartial, createConfig } from './config';
import { registerExtensions } from './register';
import { run, BettererStats } from './runner';

export * from './config';
export * from './context';
export * from './constants';
export * from './files';
export * from './runner';

registerExtensions();

export async function betterer(config: BettererConfigPartial): Promise<BettererStats> {
  logo();
  const finalConfig = createConfig(config);
  const result = await run(finalConfig);
  return result.stats;
}
