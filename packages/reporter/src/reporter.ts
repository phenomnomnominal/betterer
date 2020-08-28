import { errorΔ, infoΔ, successΔ, warnΔ, logoΔ, brΔ, diffΔ } from '@betterer/logger';

import { BettererContext, BettererReporter, BettererRun, BettererSummary } from '@betterer/betterer';
import {
  getTestsΔ,
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
  unexpectedDiffΔ,
  updateInstructionsΔ
} from './messages';
import { quoteΔ } from './utils';

export const defaultReporter: BettererReporter = {
  contextStart(): void {
    logoΔ();
  },
  contextEnd(_: BettererContext, summary: BettererSummary): void {
    const better = summary.better.length;
    const failed = summary.failed.length;
    const neww = summary.new.length;
    const ran = summary.ran.length;
    const same = summary.same.length;
    const skipped = summary.skipped.length;
    const updated = summary.updated.length;
    const worse = summary.worse.length;

    const { completed, expired, obsolete } = summary;

    infoΔ(testCheckedΔ(getTestsΔ(ran)));
    if (expired) {
      expired.forEach((run) => {
        errorΔ(testExpiredΔ(quoteΔ(run.name)));
      });
    }
    if (failed) {
      errorΔ(testFailedΔ(getTestsΔ(failed)));
    }
    if (neww) {
      infoΔ(testNewΔ(getTestsΔ(neww)));
    }
    if (obsolete) {
      obsolete.forEach((runName) => {
        errorΔ(testObsoleteΔ(quoteΔ(runName)));
      });
    }
    if (better) {
      successΔ(testBetterΔ(getTestsΔ(better)));
    }
    if (completed) {
      completed.forEach((run) => {
        successΔ(testCompleteΔ(quoteΔ(run.name)));
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

    if (summary.hasDiff) {
      errorΔ(unexpectedDiffΔ());
      brΔ();
      diffΔ(summary.expected, summary.result);
      brΔ();
    }
  },
  runStart(run: BettererRun): void {
    const name = quoteΔ(run.name);
    if (run.isExpired) {
      errorΔ(testExpiredΔ(name));
    }
    infoΔ(testRunningΔ(name));
  },
  runEnd(run: BettererRun): void {
    const name = quoteΔ(run.name);
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
      run.diff.log();
      brΔ();
      return;
    }
    if (run.isWorse) {
      errorΔ(testWorseΔ(name));
      brΔ();
      run.diff.log();
      brΔ();
    }
  }
};
