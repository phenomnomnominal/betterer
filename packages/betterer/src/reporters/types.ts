import { BettererError } from '@betterer/errors';

import { BettererContext, BettererRun, BettererRuns, BettererSummary, BettererSummaries } from '../context';
import { BettererFilePaths } from '../runner';

export type BettererReporter = {
  configError?(config: unknown, error: BettererError): Promise<void> | void;
  contextStart?(context: BettererContext, lifecycle: Promise<BettererSummaries>): Promise<void> | void;
  contextEnd?(context: BettererContext, summaries: BettererSummaries): Promise<void> | void;
  contextError?(context: BettererContext, error: BettererError): Promise<void> | void;
  runsStart?(
    runs: BettererRuns,
    filePaths: BettererFilePaths,
    lifecycle: Promise<BettererSummary>
  ): Promise<void> | void;
  runsEnd?(summary: BettererSummary, filePaths: BettererFilePaths): Promise<void> | void;
  runsError?(runs: BettererRuns, filePaths: BettererFilePaths, error: BettererError): Promise<void> | void;
  runStart?(run: BettererRun, lifecycle: Promise<void>): Promise<void> | void;
  runEnd?(run: BettererRun): Promise<void> | void;
  runError?(run: BettererRun, error: BettererError): Promise<void> | void;
};

export type BettererReporterModule = {
  reporter: BettererReporter;
};
