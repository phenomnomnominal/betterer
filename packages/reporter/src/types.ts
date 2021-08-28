import { BettererRun, BettererRunSummary } from '@betterer/betterer';
import { BettererTasksDone } from '@betterer/tasks';

import { BettererReporterAction } from './state';

export type BettererReporterRenderer = {
  render: (action?: BettererReporterAction, done?: BettererTasksDone) => void;
  stop: () => void;
};

export type BettererReporterRun = BettererRun & {
  lifecycle: Promise<BettererRunSummary>;
};
