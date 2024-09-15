import type { BettererRun, BettererRunSummary } from '@betterer/betterer';
import type { BettererTasksDone } from '@betterer/tasks';

import type { BettererReporterAction } from './state/index.js';

export interface BettererReporterRenderer {
  render: (action?: BettererReporterAction, done?: BettererTasksDone) => void;
  stop: () => void;
}

export type BettererReporterRun = BettererRun & {
  lifecycle: Defer<BettererRunSummary>;
};

type Resolve<T> = (value: T) => void;
type Reject = (error: Error) => void;

/** @knipignore */
export interface Defer<T> {
  promise: Promise<T>;
  resolve: Resolve<T>;
  reject: Reject;
}
