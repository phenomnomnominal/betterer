import { BettererRuns } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { BettererTaskContext, BettererTaskLogger } from '@betterer/logger';

import {
  testBetterΔ,
  testCompleteΔ,
  testExpiredΔ,
  testFailedΔ,
  testNewΔ,
  testRunningΔ,
  testSameΔ,
  testSkippedΔ,
  testUpdatedΔ,
  testWorseΔ
} from '../../messages';
import { quoteΔ } from '../../utils';

const RUNS_CONTEXT_CACHE = new Map<BettererRuns, Array<BettererTaskContext>>();

export function getContexts(runs: BettererRuns): Array<BettererTaskContext> {
  if (RUNS_CONTEXT_CACHE.has(runs)) {
    return RUNS_CONTEXT_CACHE.get(runs) as Array<BettererTaskContext>;
  }
  const toCache = runs.map((run) => {
    return {
      name: run.name,
      run: async (logger: BettererTaskLogger) => {
        const name = quoteΔ(run.name);
        if (run.isExpired) {
          await logger.warn(testExpiredΔ(name));
        }
        await logger.progress(testRunningΔ(name));

        await run.lifecycle;

        if (run.isComplete) {
          return testCompleteΔ(name, run.isNew);
        }
        if (run.isBetter) {
          return testBetterΔ(name);
        }
        if (run.isFailed) {
          throw new BettererError(testFailedΔ(name));
        }
        if (run.isNew) {
          return testNewΔ(name);
        }
        if (run.isSkipped) {
          return testSkippedΔ(name);
        }
        if (run.isSame) {
          return testSameΔ(name);
        }
        if (run.isUpdated) {
          await run.diff.log(logger);
          return testUpdatedΔ(name);
        }
        if (run.isWorse) {
          await run.diff.log(logger);
          throw new BettererError(testWorseΔ(name));
        }
        return;
      }
    };
  });
  RUNS_CONTEXT_CACHE.set(runs, toCache);
  return toCache;
}
