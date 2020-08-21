import { errorΔ, infoΔ, successΔ, warnΔ, logoΔ, brΔ } from '@betterer/logger';

import { BettererContext, BettererReporter, BettererRun, BettererStats } from '@betterer/betterer';
import {
  testBetter,
  testChecked,
  testComplete,
  testExpired,
  testFailed,
  testNew,
  testObsolete,
  testRunning,
  testSame,
  testSkipped,
  testUpdated,
  testWorse,
  updateInstructions,
  getTests
} from './messages';
import { contextError, quote } from './utils';

export const defaultReporter: BettererReporter = {
  contextStart(): void {
    logoΔ();
  },
  contextEnd(_: BettererContext, stats: BettererStats): void {
    const better = stats.better.length;
    const failed = stats.failed.length;
    const neww = stats.new.length;
    const ran = stats.ran.length;
    const same = stats.same.length;
    const skipped = stats.skipped.length;
    const updated = stats.updated.length;
    const worse = stats.worse.length;
    const { completed, expired, obsolete } = stats;

    infoΔ(testChecked(getTests(ran)));
    if (expired) {
      expired.forEach((testName) => {
        errorΔ(testExpired(quote(testName)));
      });
    }
    if (failed) {
      errorΔ(testFailed(getTests(failed)));
    }
    if (neww) {
      infoΔ(testNew(getTests(neww)));
    }
    if (obsolete) {
      obsolete.forEach((testName) => {
        errorΔ(testObsolete(quote(testName)));
      });
    }
    if (better) {
      successΔ(testBetter(getTests(better)));
    }
    if (completed.length) {
      completed.forEach((testName) => {
        successΔ(testComplete(quote(testName)));
      });
    }
    if (same) {
      warnΔ(testSame(getTests(same)));
    }
    if (skipped) {
      warnΔ(testSkipped(getTests(skipped)));
    }
    if (updated) {
      infoΔ(testUpdated(getTests(updated)));
    }
    if (worse) {
      errorΔ(testWorse(getTests(worse)));
      errorΔ(updateInstructions());
    }
  },
  contextError,
  runStart(run: BettererRun): void {
    const name = quote(run.name);
    if (run.isExpired) {
      errorΔ(testExpired(name));
    }
    infoΔ(testRunning(name));
  },
  runEnd(run: BettererRun): void {
    const name = quote(run.name);
    if (run.isComplete) {
      successΔ(testComplete(name, run.isNew));
      return;
    }
    if (run.isBetter) {
      successΔ(testBetter(name));
      return;
    }
    if (run.isFailed) {
      errorΔ(testFailed(name));
      return;
    }
    if (run.isNew) {
      successΔ(testNew(name));
      return;
    }
    if (run.isSame) {
      warnΔ(testSame(name));
    }
    if (run.isUpdated) {
      infoΔ(testUpdated(name));
      brΔ();
      run.diff();
      brΔ();
      return;
    }
    if (run.isWorse) {
      errorΔ(testWorse(name));
      brΔ();
      run.diff();
      brΔ();
    }
  }
};
