import { BettererContext, BettererSuiteSummary, BettererContextSummary } from '@betterer/betterer';
import { BettererSuite } from '@betterer/betterer/src/suite';

import { BettererReporterAction } from './actions';

export type BettererReporterState = {
  context: BettererContext;
  contextSummary?: BettererContextSummary;
  suite?: BettererSuite;
  suiteSummary?: BettererSuiteSummary;
};

export type BettererReporterDispatch = (action?: BettererReporterAction) => BettererReporterState;
