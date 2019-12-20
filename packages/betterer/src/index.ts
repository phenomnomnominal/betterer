import { header } from '@betterer/logger';

import { BettererConfig } from './config';
import { registerExtensions } from './register';
import { run } from './runner';
import { BettererStats } from './statistics';

export * from './config';
export * from './constants';
export * from './files';
export * from './statistics';
export * from './types';

registerExtensions();

export function betterer(config: BettererConfig): Promise<BettererStats> {
  header(`
   \\ | /     _          _   _                     
 '-.ooo.-'  | |__   ___| |_| |_ ___ _ __ ___ _ __ 
---ooooo--- | '_ \\ / _ \\ __| __/ _ \\ '__/ _ \\ '__|
 .-'ooo'-.  | |_) |  __/ |_| ||  __/ | |  __/ |   
   / | \\    |_.__/ \\___|\\__|\\__\\___|_|  \\___|_|   
 `);
  return run(config);
}
