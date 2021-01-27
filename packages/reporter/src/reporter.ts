import {
  BettererConfigPartial,
  BettererContext,
  BettererReporter,
  BettererRun,
  BettererSummary
} from '@betterer/betterer';
import { BettererError, isBettererError } from '@betterer/errors';
import { BettererConsoleLogger, diffΔ, LOGO } from '@betterer/logger';

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

const logger = new BettererConsoleLogger();

export const defaultReporter: BettererReporter = {
  configError(_: BettererConfigPartial, error: BettererError): void {
    logErrorΔ(error);
  },
  contextStart(): void {
    // eslint-disable-next-line no-console
    console.log(LOGO);
  },
  contextEnd(_: BettererContext, summary: BettererSummary): void {
    const better = summary.better.length;
    const failed = summary.failed.length;
    const ran = summary.ran.length;
    const same = summary.same.length;
    const skipped = summary.skipped.length;
    const updated = summary.updated.length;
    const worse = summary.worse.length;

    const { completed, expired, obsolete } = summary;

    logger.info(testCheckedΔ(getTestsΔ(ran)));
    if (expired) {
      expired.forEach((run) => {
        logger.error(testExpiredΔ(quoteΔ(run.name)));
      });
    }
    if (failed) {
      logger.error(testFailedΔ(getTestsΔ(failed)));
    }
    if (summary.new.length) {
      logger.info(testNewΔ(getTestsΔ(summary.new.length)));
    }
    if (obsolete) {
      obsolete.forEach((runName) => {
        logger.error(testObsoleteΔ(quoteΔ(runName)));
      });
    }
    if (better) {
      logger.success(testBetterΔ(getTestsΔ(better)));
    }
    if (completed) {
      completed.forEach((run) => {
        logger.success(testCompleteΔ(quoteΔ(run.name)));
      });
    }
    if (same) {
      logger.warn(testSameΔ(getTestsΔ(same)));
    }
    if (skipped) {
      logger.warn(testSkippedΔ(getTestsΔ(skipped)));
    }
    if (updated) {
      logger.info(testUpdatedΔ(getTestsΔ(updated)));
    }
    if (worse) {
      logger.error(testWorseΔ(getTestsΔ(worse)));
      logger.error(updateInstructionsΔ());
    }

    if (summary.hasDiff) {
      logger.error(unexpectedDiffΔ());
      /* eslint-disable no-console */
      console.log();
      console.log(diffΔ(summary.expected, summary.result) as string);
      console.log();
      /* eslint-enable no-console */
    }
  },
  contextError(_: BettererContext, error: BettererError): void {
    logErrorΔ(error);
  },
  runStart(run: BettererRun): void {
    const name = quoteΔ(run.name);
    if (run.isExpired) {
      logger.error(testExpiredΔ(name));
    }
    logger.info(testRunningΔ(name));
  },
  runEnd(run: BettererRun): void {
    const name = quoteΔ(run.name);
    if (run.isComplete) {
      logger.success(testCompleteΔ(name, run.isNew));
      return;
    }
    if (run.isBetter) {
      logger.success(testBetterΔ(name));
      return;
    }
    if (run.isFailed) {
      logger.error(testFailedΔ(name));
      return;
    }
    if (run.isNew) {
      logger.success(testNewΔ(name));
      return;
    }
    if (run.isSame) {
      logger.warn(testSameΔ(name));
    }
    if (run.isUpdated) {
      logger.info(testUpdatedΔ(name));
      // eslint-disable-next-line no-console
      console.log();
      run.diff.log(logger);
      // eslint-disable-next-line no-console
      console.log();
      return;
    }
    if (run.isWorse) {
      logger.error(testWorseΔ(name));
      // eslint-disable-next-line no-console
      console.log();
      run.diff.log(logger);
      // eslint-disable-next-line no-console
      console.log();
    }
  },
  runError(_: BettererRun, error: BettererError) {
    logErrorΔ(error);
  }
};

function logErrorΔ(err: Error | BettererError): void {
  if (isBettererError(err)) {
    const errors = err.details.filter((detail) => isError(detail)) as Array<Error>;
    logger.error(err.message);
    errors.forEach(logErrorΔ);
    return;
  }
  /* eslint-disable no-console */
  console.log();
  console.error(err.stack);
  console.log();
  /* eslint-enable no-console */
}

function isError(err: unknown): err is Error {
  return (err as Error).message != null && (err as Error).stack !== null;
}
