import type { BettererConfig } from './config/index.js';
import type { BettererVersionControlWorker } from './fs/index.js';
import type { BettererResultsFileΩ } from './results/index.js';

export type MaybeAsync<T> = T | Promise<T>;

export interface BettererGlobals {
  config: BettererConfig;
  resultsFile: BettererResultsFileΩ;
  versionControl: BettererVersionControlWorker;
}
