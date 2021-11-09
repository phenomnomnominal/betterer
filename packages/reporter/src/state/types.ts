import { BettererContext, BettererSuite, BettererSuiteSummary, BettererContextSummary } from '@betterer/betterer';
import { BettererTasksDone } from '@betterer/tasks';

import { BettererReporterAction } from './actions';

export interface BettererReporterState {
  context: BettererContext;
  contextSummary?: BettererContextSummary;
  done?: BettererTasksDone;
  suite?: BettererSuite;
  suiteSummary?: BettererSuiteSummary;
}

export type BettererReporterDispatch = (action?: BettererReporterAction) => BettererReporterState;
