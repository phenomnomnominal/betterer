import { BettererConfig } from './config';
import { BettererVersionControlWorker } from './fs';
import { BettererReporterΩ } from './reporters';
import { BettererResultsΩ } from './results';
import { BettererRunWorkerPoolΩ } from './run';

export type MaybeAsync<T> = T | Promise<T>;

export type BettererGlobals = {
  config: BettererConfig;
  reporter: BettererReporterΩ;
  results: BettererResultsΩ;
  runWorkerPool: BettererRunWorkerPoolΩ;
  versionControl: BettererVersionControlWorker;
};
