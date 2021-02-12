import { BettererRuns } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { BettererLogger, BettererTasks } from '@betterer/logger';

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

const TASK_RUNNER_CACHE = new Map<BettererRuns, BettererTasks>();

export function getTasks(runs: BettererRuns): BettererTasks {
  if (!TASK_RUNNER_CACHE.has(runs)) {
    TASK_RUNNER_CACHE.set(
      runs,
      runs.map((run) => ({
        name: run.name,
        run: async (logger: BettererLogger) => {
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
      }))
    );
  }
  return TASK_RUNNER_CACHE.get(runs) as BettererTasks;
}
