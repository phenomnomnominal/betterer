import { BettererError } from '@betterer/errors';

import { BettererContext, BettererContextSummary } from '../context';
import { BettererRun, BettererRunSummary } from '../run';
import { BettererSuiteSummary, BettererSuite } from '../suite';

export type BettererReporter = {
  configError?(config: unknown, error: BettererError): Promise<void> | void;
  contextStart?(context: BettererContext, lifecycle: Promise<BettererContextSummary>): Promise<void> | void;
  contextEnd?(contextSummary: BettererContextSummary): Promise<void> | void;
  contextError?(context: BettererContext, error: BettererError): Promise<void> | void;
  suiteStart?(suite: BettererSuite, lifecycle: Promise<BettererSuiteSummary>): Promise<void> | void;
  suiteEnd?(suiteSummary: BettererSuiteSummary): Promise<void> | void;
  suiteError?(suite: BettererSuite, error: BettererError): Promise<void> | void;
  runStart?(run: BettererRun, lifecycle: Promise<BettererRunSummary>): Promise<void> | void;
  runEnd?(run: BettererRunSummary): Promise<void> | void;
  runError?(run: BettererRun, error: BettererError): Promise<void> | void;
};

export type BettererReporterModule = {
  reporter: BettererReporter;
};
