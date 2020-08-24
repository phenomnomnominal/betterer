import { errorΔ, infoΔ, successΔ, warnΔ, logoΔ, brΔ } from '@betterer/logger';

import { BettererContext, BettererReporter, BettererRun, BettererStats } from '@betterer/betterer';
import {
  testBetterΔ,
  testCheckedΔ,
  testCompleteΔ,
  testExpiredΔ,
  testFailedΔ,
  testNewΔ,
  testObsoleteΔ,
  testRunningΔ,
  testSameΔ,
  testSkippedΔ,
  testUpdatedΔ,
  testWorseΔ,
  updateInstructionsΔ,
  getTestsΔ
} from './messages';
import { contextErrorΔ, quoteΔ } from './utils';

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

    infoΔ(testCheckedΔ(getTestsΔ(ran)));
    if (expired) {
      expired.forEach((testName) => {
        errorΔ(testExpiredΔ(quoteΔ(testName)));
      });
    }
    if (failed) {
      errorΔ(testFailedΔ(getTestsΔ(failed)));
    }
    if (neww) {
      infoΔ(testNewΔ(getTestsΔ(neww)));
    }
    if (obsolete) {
      obsolete.forEach((testName) => {
        errorΔ(testObsoleteΔ(quoteΔ(testName)));
      });
    }
    if (better) {
      successΔ(testBetterΔ(getTestsΔ(better)));
    }
    if (completed.length) {
      completed.forEach((testName) => {
        successΔ(testCompleteΔ(quoteΔ(testName)));
      });
    }
    if (same) {
      warnΔ(testSameΔ(getTestsΔ(same)));
    }
    if (skipped) {
      warnΔ(testSkippedΔ(getTestsΔ(skipped)));
    }
    if (updated) {
      infoΔ(testUpdatedΔ(getTestsΔ(updated)));
    }
    if (worse) {
      errorΔ(testWorseΔ(getTestsΔ(worse)));
      errorΔ(updateInstructionsΔ());
    }
  },
  contextError: contextErrorΔ,
  runStart(run: BettererRun): void {
    const name = quoteΔ(run.test.name);
    if (run.isExpired) {
      errorΔ(testExpiredΔ(name));
    }
    infoΔ(testRunningΔ(name));
  },
  runEnd(run: BettererRun): void {
    const name = quoteΔ(run.test.name);
    if (run.isComplete) {
      successΔ(testCompleteΔ(name, run.isNew));
      return;
    }
    if (run.isBetter) {
      successΔ(testBetterΔ(name));
      return;
    }
    if (run.isFailed) {
      errorΔ(testFailedΔ(name));
      return;
    }
    if (run.isNew) {
      successΔ(testNewΔ(name));
      return;
    }
    if (run.isSame) {
      warnΔ(testSameΔ(name));
    }
    if (run.isUpdated) {
      infoΔ(testUpdatedΔ(name));
      brΔ();
      run.diff();
      brΔ();
      return;
    }
    if (run.isWorse) {
      errorΔ(testWorseΔ(name));
      brΔ();
      run.diff();
      brΔ();
    }
  }
};
