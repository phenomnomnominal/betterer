import { BettererError } from '@betterer/errors';

import { BettererContext, BettererRuns, BettererRun } from '../context';
import { BettererFilePaths } from '../watcher';

export type BettererContextReporter = {
  start?(): void;
  finish?(context: BettererContext): void;
  error?(error: BettererError, printed: Array<string>): void;
};

export type BettererRunnerReporter = {
  start?(files: BettererFilePaths): void;
  end?(runs: BettererRuns, files: BettererFilePaths): void;
};

export type BettererRunReporter = {
  better?(run: BettererRun): void;
  failed?(run: BettererRun): void;
  neww?(run: BettererRun): void;
  same?(run: BettererRun): void;
  start?(run: BettererRun): void;
  worse?(run: BettererRun): void;
};

export type BettererReporters = {
  context?: BettererContextReporter;
  runner?: BettererRunnerReporter;
  run?: BettererRunReporter;
};
