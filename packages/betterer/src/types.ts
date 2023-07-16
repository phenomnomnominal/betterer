import type { BettererConfig } from './config';
import type { BettererVersionControlWorker } from './fs';
import type { BettererResultsFileΩ } from './results';

export type MaybeAsync<T> = T | Promise<T>;

export interface BettererGlobals {
  config: BettererConfig;
  resultsFile: BettererResultsFileΩ;
  versionControl: BettererVersionControlWorker;
}
