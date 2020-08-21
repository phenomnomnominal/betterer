import { error, info, success, warn, logo, br } from '@betterer/logger';

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
    logo();
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

    info(testCheckedΔ(getTestsΔ(ran)));
    if (expired) {
      expired.forEach((testName) => {
        error(testExpiredΔ(quoteΔ(testName)));
      });
    }
    if (failed) {
      error(testFailedΔ(getTestsΔ(failed)));
    }
    if (neww) {
      info(testNewΔ(getTestsΔ(neww)));
    }
    if (obsolete) {
      obsolete.forEach((testName) => {
        error(testObsoleteΔ(quoteΔ(testName)));
      });
    }
    if (better) {
      success(testBetterΔ(getTestsΔ(better)));
    }
    if (completed.length) {
      completed.forEach((testName) => {
        success(testCompleteΔ(quoteΔ(testName)));
      });
    }
    if (same) {
      warn(testSameΔ(getTestsΔ(same)));
    }
    if (skipped) {
      warn(testSkippedΔ(getTestsΔ(skipped)));
    }
    if (updated) {
      info(testUpdatedΔ(getTestsΔ(updated)));
    }
    if (worse) {
      error(testWorseΔ(getTestsΔ(worse)));
      error(updateInstructionsΔ());
    }
  },
  contextError: contextErrorΔ,
  runStart(run: BettererRun): void {
    const name = quoteΔ(run.name);
    if (run.isExpired) {
      error(testExpiredΔ(name));
    }
    info(testRunningΔ(name));
  },
  runEnd(run: BettererRun): void {
    const name = quoteΔ(run.name);
    if (run.isComplete) {
      success(testCompleteΔ(name, run.isNew));
      return;
    }
    if (run.isBetter) {
      success(testBetterΔ(name));
      return;
    }
    if (run.isFailed) {
      error(testFailedΔ(name));
      return;
    }
    if (run.isNew) {
      success(testNewΔ(name));
      return;
    }
    if (run.isSame) {
      warn(testSameΔ(name));
    }
    if (run.isUpdated) {
      info(testUpdatedΔ(name));
      br();
      run.diff();
      br();
      return;
    }
    if (run.isWorse) {
      error(testWorseΔ(name));
      br();
      run.diff();
      br();
    }
  }
};
