import { BettererError } from '@betterer/errors';

import { BettererRuns, BettererRun, BettererStats } from '../context';
import { BettererFilePaths } from '../watcher';

export type BettererContextReporter = {
  start(): void;
  finish(stats: BettererStats): void;
  error(error: BettererError, printed: Array<string>): void;
};

export type BettererRunnerReporter = {
  start(files: BettererFilePaths): void;
  end(runs: BettererRuns, files: BettererFilePaths): void;
};

export type BettererRunReporter = {
  better(run: BettererRun): void;
  failed(run: BettererRun): void;
  neww(run: BettererRun): void;
  same(run: BettererRun): void;
  start(run: BettererRun): void;
  worse(run: BettererRun): void;
};

export type BettererReporters = {
  context?: BettererContextReporter;
  runner?: BettererRunnerReporter;
  run?: BettererRunReporter;
};
