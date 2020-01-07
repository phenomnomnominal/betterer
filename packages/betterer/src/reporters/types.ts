import { BettererError } from '@betterer/errors';

import { BettererFilePaths } from '../betterer';
import { BettererContext, BettererRuns, BettererRun } from '../context';

export type BettererContextReporter = {
  start?(): void;
  complete?(context: BettererContext): void;
  error?(error: BettererError, printed: string): void;
};

export type BettererRunnerReporter = {
  start?(files: BettererFilePaths): void;
  end?(runs: BettererRuns, files: BettererFilePaths): void;
};

export type BettererRunReporter = {
  better?(run: BettererRun): void;
  failed?(run: BettererRun): void;
  ['new']?(run: BettererRun): void;
  same?(run: BettererRun): void;
  start?(run: BettererRun): void;
  worse?(run: BettererRun): void;
};

export type BettererReporters = {
  context?: BettererContextReporter;
  runner?: BettererRunnerReporter;
  run?: BettererRunReporter;
};
// Hack:
