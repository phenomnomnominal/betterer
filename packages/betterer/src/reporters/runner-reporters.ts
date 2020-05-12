import { overwrite } from '@betterer/logger';

import { BettererRuns } from '../context';
import { BettererRunnerReporter } from './types';
import { BettererFilePaths } from '../watcher';

export const runnerParallel: BettererRunnerReporter = {
  start(files: BettererFilePaths): void {
    overwrite(`checking ${files.length} files... 🤔`);
  },
  end(runs: BettererRuns, files: BettererFilePaths): void {
    let report = `  checked ${files.length} files:\n`;
    files.forEach((filePath) => {
      report += `\n    ${filePath}`;
    });
    report += '\n';
    runs.forEach((run) => {
      const { name, isComplete } = run;
      if (run.isBetter) {
        if (isComplete) {
          report += `\n  "${name}" met its goal! 🎉`;
          return;
        }
        report += `\n  "${name}" got better! 😍`;
        return;
      }
      if (run.isFailed) {
        report += `\n  "${run.name}" failed to run. 🔥`;
        return;
      }
      if (run.isNew) {
        if (isComplete) {
          report += `\n  "${name}" has already met its goal! ✨`;
          return;
        }
        report += `\n  "${name}" got checked for the first time! 🎉`;
        return;
      }
      if (run.isSame) {
        report += `\n  "${name}" stayed the same. 😐`;
        return;
      }
      if (run.isWorse) {
        report += `\n  "${name}" got worse. 😔`;
        return;
      }
    });
    overwrite(report);
  }
};
