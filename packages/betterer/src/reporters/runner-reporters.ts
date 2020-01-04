import { overwrite } from '@betterer/logger';

import { BettererRuns } from '../context';
import { BettererFilePaths } from '../files';
import { BettererRunnerReporter } from './types';

export const runnerParallel: BettererRunnerReporter = {
  end(runs: BettererRuns, files: BettererFilePaths): void {
    debugger;
    console.log(runs, files);
    overwrite(`end`);
  }
};
