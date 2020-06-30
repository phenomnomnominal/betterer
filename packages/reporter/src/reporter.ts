import { error, info, success, warn, logo, br } from '@betterer/logger';

import { BettererContext, BettererReporter, BettererRun, BettererStats } from '@betterer/betterer';
import {
  testBetter,
  testChecked,
  testComplete,
  testExpired,
  testFailed,
  testNew,
  testRunning,
  testSame,
  testSkipped,
  testWorse,
  testObsolete,
  getTests
} from './messages';
import { contextError, quote } from './utils';

export const defaultReporter: BettererReporter = {
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

    info(testChecked(getTests(ran)));
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
      run.diff();
      br();
    }
  }
};
