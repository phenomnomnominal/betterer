import type { BettererContext, BettererSuite, BettererSuiteSummary, BettererContextSummary } from '@betterer/betterer';
import type { BettererTasksDone } from '@betterer/tasks';

import type { BettererReporterAction } from './actions';

export interface BettererReporterState {
  context: BettererContext;
  contextSummary?: BettererContextSummary;
  done?: BettererTasksDone;
  suite?: BettererSuite;
  suiteSummary?: BettererSuiteSummary;
}

export type BettererReporterDispatch = (action?: BettererReporterAction) => BettererReporterState;
