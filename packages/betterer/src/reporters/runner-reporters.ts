import { overwrite } from '@betterer/logger';

import { BettererFilePaths } from '../betterer';
import { BettererRuns } from '../context';
import { BettererRunnerReporter } from './types';

export const runnerParallel: BettererRunnerReporter = {
  end(runs: BettererRuns, files: BettererFilePaths): void {
    console.log(runs, files);
    overwrite(`end`);
  }
};
