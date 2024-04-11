import type { BettererConfig } from './config/index.js';
import type { BettererVersionControlWorker } from './fs/index.js';
import type { BettererResultsΩ } from './results/index.js';

export type MaybeAsync<T> = T | Promise<T>;

export interface BettererGlobals {
  config: BettererConfig;
  results: BettererResultsΩ;
  versionControl: BettererVersionControlWorker;
}
