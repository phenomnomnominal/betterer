import { BettererConfig } from './config';
import { BettererVersionControlWorker } from './fs';
import { BettererReporterΩ } from './reporters';
import { BettererResultsΩ } from './results';
import { BettererWorkerPoolΩ } from './run';

export type MaybeAsync<T> = T | Promise<T>;

export type BettererGlobals = {
  config: BettererConfig;
  reporter: BettererReporterΩ;
  results: BettererResultsΩ;
  versionControl: BettererVersionControlWorker;
  workerPool: BettererWorkerPoolΩ;
};
