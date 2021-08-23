import { BettererConfig } from './config';
import { BettererVersionControlWorker } from './fs';
import { BettererResultsFileΩ } from './results';

export type MaybeAsync<T> = T | Promise<T>;

export type BettererGlobals = {
  config: BettererConfig;
  resultsFile: BettererResultsFileΩ;
  versionControl: BettererVersionControlWorker;
};
