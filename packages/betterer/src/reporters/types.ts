import { BettererError } from '@betterer/errors';

import { BettererRuns, BettererRun, BettererStats } from '../context';
import { BettererFilePaths } from '../watcher';

export type BettererReporter = {
  contextStart?(): void;
  contextEnd?(stats: BettererStats): void;
  contextError?(error: BettererError, printed: Array<string>): void;
  runsStart?(files: BettererFilePaths): void;
  runsEnd?(runs: BettererRuns, files: BettererFilePaths): void;
  runStart?(run: BettererRun): void;
  runEnd?(run: BettererRun): void;
};
