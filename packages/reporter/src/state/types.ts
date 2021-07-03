import {
  BettererContext,
  BettererFilePaths,
  BettererRuns,
  BettererRunSummaries,
  BettererSummaries,
  BettererSummary
} from '@betterer/betterer';

import { BettererReporterAction } from './actions';

export type BettererReporterState = {
  context: BettererContext;
  filePaths?: BettererFilePaths;
  runs?: BettererRuns;
  runSummaries?: BettererRunSummaries;
  suiteSummary?: BettererSummary;
  suiteSummaries?: BettererSummaries;
};

export type BettererReporterDispatch = (action?: BettererReporterAction) => BettererReporterState;
