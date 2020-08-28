import { BettererError } from '@betterer/errors';

import { BettererContext, BettererRun, BettererRuns, BettererSummary } from '../context';
import { BettererFilePaths } from '../watcher';

export type BettererReporter = {
  contextStart?(context: BettererContext): void;
  contextEnd?(context: BettererContext, summary: BettererSummary): void;
  contextError?(context: BettererContext, error: BettererError): void;
  runsStart?(runs: BettererRuns, files: BettererFilePaths): void;
  runsEnd?(runs: BettererRuns, files: BettererFilePaths): void;
  runStart?(run: BettererRun): void;
  runEnd?(run: BettererRun): void;
};

export type BettererReporterNames = ReadonlyArray<string>;

export type BettererReporterModule = {
  reporter: BettererReporter;
};
