import type { BettererRun, BettererRunSummary } from '@betterer/betterer';
import type { BettererTasksDone } from '@betterer/tasks';

import type { BettererReporterAction } from './state';

export interface BettererReporterRenderer {
  render: (action?: BettererReporterAction, done?: BettererTasksDone) => void;
  stop: () => void;
}

export type BettererReporterRun = BettererRun & {
  lifecycle: Promise<BettererRunSummary>;
};
