import { BettererError, logError } from '@betterer/errors';
import { error, info, success, warn, logo, overwrite, br } from '@betterer/logger';

import { BettererContext, BettererRun, BettererRuns, BettererStats } from '../context';
import {
  watchEnd,
  watchStart,
  filesChecked,
  filesChecking,
  testBetter,
  testComplete,
  testExpired,
  testFailed,
  testNew,
  testRunning,
  testSame,
  testSkipped,
  testWorse,
  testObsolete
} from '../messages';
import { diff } from '../results';
import { BettererFilePaths } from '../watcher';
import { BettererReporter } from './types';

function contextError(_: BettererContext, error: BettererError, printed: Array<string>): void {
  logError(error);
  process.stdout.write(printed.join(''));
}

export const reporterParallel: BettererReporter = {
  contextStart(): void {
    info(watchStart());
  },
  contextEnd(): void {
    info(watchEnd());
  },
  contextError,
  runsStart(_: BettererRuns, files: BettererFilePaths): void {
    overwrite(filesChecking(files.length));
  },
  runsEnd(runs: BettererRuns, files: BettererFilePaths): void {
    let report = `  ${filesChecked(files.length)}:\n`;
    files.forEach((filePath) => {
      report += `\n    ${filePath}`;
    });
    report += '\n';
    runs.forEach((run) => {
      const name = quote(run.name);

      if (run.isBetter) {
        report += `\n  ${testBetter(name)}`;
        return;
      }
      if (run.isExpired) {
        report += `\n  ${testExpired(name)}`;
        return;
      }
      if (run.isFailed) {
        report += `\n  ${testFailed(run.name)}`;
        return;
      }
      if (run.isNew) {
        report += `\n  ${testNew(name)}`;
        return;
      }
      if (run.isSame) {
        report += `\n  ${testSame(name)}`;
        return;
      }
      if (run.isWorse) {
        report += `\n  ${testWorse(name)}`;
        return;
      }
      if (run.isComplete) {
        report += `\n  ${testComplete(name, run.isNew)}`;
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
  contextEnd(_: BettererContext, stats: BettererStats): void {
    const ran = stats.ran.length;
    const failed = stats.failed.length;
    const neww = stats.new.length;
    const better = stats.better.length;
    const worse = stats.worse.length;
    const same = stats.same.length;
    const skipped = stats.skipped.length;
    const { completed, expired, obsolete } = stats;

    info(`${getTests(ran)} got checked. 🤔`);
    if (expired) {
      expired.forEach((testName) => {
        error(testExpired(quote(testName)));
      });
    }
    if (failed) {
      error(testFailed(getTests(failed)));
    }
    if (neww) {
      info(testNew(getTests(neww)));
    }
    if (obsolete) {
      obsolete.forEach((testName) => {
        error(testObsolete(quote(testName)));
      });
    }
    if (better) {
      success(testBetter(getTests(better)));
    }
    if (completed.length) {
      completed.forEach((testName) => {
        success(testComplete(quote(testName)));
      });
    }
    if (worse) {
      error(testWorse(getTests(worse)));
    }
    if (same) {
      warn(testSame(getTests(same)));
    }
    if (skipped) {
      warn(testSkipped(getTests(skipped)));
    }
  },
  contextError,
  runStart(run: BettererRun): void {
    const name = quote(run.name);
    if (run.isExpired) {
      error(testExpired(name));
    }
    info(testRunning(name));
  },
  runEnd(run: BettererRun): void {
    const name = quote(run.name);
    if (run.isComplete) {
      success(testComplete(name, run.isNew));
      return;
    }
    if (run.isBetter) {
      success(testBetter(name));
      return;
    }
    if (run.isFailed) {
      error(testFailed(name));
      return;
    }
    if (run.isNew) {
      success(testNew(name));
      return;
    }
    if (run.isSame) {
      warn(testSame(name));
    }
    if (run.isWorse) {
      error(testWorse(name));
      br();
      diff(run);
      br();
    }
  }
};

function getTests(count: number): string {
  return `${count} ${count === 1 ? 'test' : 'tests'}`;
}

function quote(str: string): string {
  if (!str.startsWith('"')) {
    str = `"${str}`;
  }
  if (!str.endsWith('"')) {
    str = `${str}"`;
  }
  return str;
}
