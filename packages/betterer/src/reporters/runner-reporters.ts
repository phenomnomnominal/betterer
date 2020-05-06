import { overwrite } from '@betterer/logger';

import { BettererRuns } from '../context';
import { BettererRunnerReporter } from './types';
import { BettererFilePaths } from '../watcher';

export const runnerParallel: BettererRunnerReporter = {
  start(files: BettererFilePaths): void {
    overwrite(`checking ${files.length} files... 🤔`);
  },
  end(runs: BettererRuns, files: BettererFilePaths): void {
    let report = `checked ${files.length} files:\n`;
    files.forEach((filePath) => {
      report += `\n  ${filePath}`;
    });
    report += '\n';
    const better = runs.filter((run) => run.isBetter);
    const failed = runs.filter((run) => run.isFailed);
    const worse = runs.filter((run) => run.isWorse);
    better.forEach((run) => {
      report += `"${run.name}" got better! 😍`;
    });
    failed.forEach((run) => {
      report += `"${run.name}" failed to run. 🔥`;
    });
    worse.forEach((run) => {
      report += `"${run.name}" got worse. 😔`;
    });
    overwrite(report);
  }
};
