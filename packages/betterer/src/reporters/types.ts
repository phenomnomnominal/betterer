import { BettererError } from '@betterer/errors';

import { BettererConfigPartial } from '../config';
import { BettererContext, BettererRun, BettererRuns, BettererSummary } from '../context';
import { BettererFilePaths } from '../watcher';

export type BettererReporter = {
  configError?(config: BettererConfigPartial, error: BettererError): Promise<void> | void;
  contextStart?(context: BettererContext, lifecycle: Promise<BettererSummary>): Promise<void> | void;
  contextEnd?(context: BettererContext, summary: BettererSummary): Promise<void> | void;
  contextError?(context: BettererContext, error: BettererError): Promise<void> | void;
  runsStart?(runs: BettererRuns, files: BettererFilePaths): Promise<void> | void;
  runsEnd?(runs: BettererRuns, files: BettererFilePaths): Promise<void> | void;
  runStart?(run: BettererRun, lifecycle: Promise<void>): Promise<void> | void;
  runEnd?(run: BettererRun): Promise<void> | void;
  runError?(run: BettererRun, error: BettererError): Promise<void> | void;
};

export type BettererReporterNames = ReadonlyArray<string>;

export type BettererReporterModule = {
  reporter: BettererReporter;
};
