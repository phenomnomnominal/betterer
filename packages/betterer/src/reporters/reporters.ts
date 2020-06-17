import { BettererError, logError } from '@betterer/errors';
import { error, info, success, warn, logo, overwrite, br } from '@betterer/logger';

import { BettererStats, BettererRuns, BettererRun } from '../context';
import { diff } from '../results';
import { BettererFilePaths } from '../watcher';
import { BettererReporter } from './types';

function contextError(error: BettererError, printed: Array<string>): void {
  logError(error);
  process.stdout.write(printed.join(''));
}

export const reporterParallel: BettererReporter = {
  contextStart(): void {
    info('Running betterer in watch mode 🎉');
  },
  contextEnd(): void {
    info('Stopping watch mode 👋');
  },
  contextError,
  runsStart(files: BettererFilePaths): void {
    overwrite(`checking ${files.length} files... 🤔`);
  },
  runsEnd(runs: BettererRuns, files: BettererFilePaths): void {
    let report = `  checked ${files.length} files:\n`;
    files.forEach((filePath) => {
      report += `\n    ${filePath}`;
    });
    report += '\n';
    runs.forEach((run) => {
      const { name } = run;
      if (run.isBetter) {
        report += `\n  "${name}" got better! 😍`;
        return;
      }
      if (run.isExpired) {
        report += `\n  "${name}" has passed its deadline. ☠️`;
        return;
      }
      if (run.isFailed) {
        report += `\n  "${run.name}" failed to run. 🔥`;
        return;
      }
      if (run.isNew) {
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
      if (run.isComplete) {
        report += `\n  "${name}"${run.isNew ? ' already' : ''} met its goal! 🎉`;
        return;
      }
    });
    overwrite(report);
  }
};

export const reporterSerial: BettererReporter = {
  contextStart(): void {
    logo();
  },
  contextEnd(stats: BettererStats): void {
    const ran = stats.ran.length;
    const failed = stats.failed.length;
    const neww = stats.new.length;
    const obsolete = stats.obsolete.length;
    const better = stats.better.length;
    const worse = stats.worse.length;
    const same = stats.same.length;
    const skipped = stats.skipped.length;
    const { completed, expired } = stats;

    info(`${ran} ${getTests(ran)} got checked. 🤔`);
    if (expired) {
      expired.forEach((testName) => {
        error(`"${testName}" has passed its deadline. ☠️`);
      });
    }
    if (failed) {
      error(`${failed} ${getTests(failed)} failed to run. 🔥`);
    }
    if (neww) {
      info(`${neww} ${getTests(neww)} got checked for the first time! 🎉`);
    }
    if (obsolete) {
      info(`${obsolete} ${getTestsAre(obsolete)} are no longer needed! 🤪`);
    }
    if (better) {
      success(`${better} ${getTests(better)} got better! 😍`);
    }
    if (completed.length) {
      completed.forEach((testName) => {
        success(`"${testName}" met its goal! 🎉`);
      });
    }
    if (worse) {
      error(`${worse} ${getTests(worse)} got worse. 😔`);
    }
    if (same) {
      warn(`${same} ${getTests(same)} stayed the same. 😐`);
    }
    if (skipped) {
      warn(`${skipped} ${getTests(skipped)} got skipped. ❌`);
    }
  },
  contextError,
  runStart(run: BettererRun): void {
    const { isExpired, name } = run;
    if (isExpired) {
      error(`"${name}" has passed its deadline. ☠️`);
    }
    info(`running "${name}"!`);
  },
  runEnd(run: BettererRun): void {
    const { name } = run;
    if (run.isBetter) {
      if (run.isComplete) {
        success(`"${name}" met its goal! 🎉`);
        return;
      }
      success(`"${name}" got better! 😍`);
      return;
    }
    if (run.isFailed) {
      error(`"${run.name}" failed to run. 🔥`);
      return;
    }
    if (run.isNew) {
      if (run.isComplete) {
        success(`"${name}" has already met its goal! ✨`);
        return;
      }
      success(`"${name}" got checked for the first time! 🎉`);
      return;
    }
    if (run.isSame) {
      warn(`"${name}" stayed the same. 😐`);
    }
    if (run.isWorse) {
      const { name } = run;
      error(`"${name}" got worse. 😔`);
      br();
      diff(run);
      br();
    }
  }
};

function getTests(count: number): string {
  return count === 1 ? 'test' : 'tests';
}

function getTestsAre(count: number): string {
  return `${getTests(count)} ${count === 1 ? 'is' : 'are'}`;
}
