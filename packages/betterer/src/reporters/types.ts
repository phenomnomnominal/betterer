import { BettererError } from '@betterer/errors';

import { BettererContext, BettererRun, BettererRuns, BettererStats } from '../context';
import { BettererScores } from '../scorer';
import { BettererFilePaths } from '../watcher';

export type BettererReporter = {
  contextStart?(context: BettererContext): void;
  contextEnd?(context: BettererContext, stats: BettererStats): void;
  contextError?(context: BettererContext, error: BettererError, printed: Array<string>): void;
  runsStart?(runs: BettererRuns, files: BettererFilePaths): void;
  runsEnd?(runs: BettererRuns, files: BettererFilePaths): void;
  runStart?(run: BettererRun): void;
  runEnd?(run: BettererRun): void;
  score?(scores: BettererScores): void;
};

export type BettererReporterNames = ReadonlyArray<string>;

export type BettererReporterModule = {
  reporter: BettererReporter;
};
