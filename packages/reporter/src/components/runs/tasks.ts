import { BettererRuns } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { BettererLogger, BettererTasks } from '@betterer/logger';

import {
  testBetter,
  testComplete,
  testExpired,
  testFailed,
  testNew,
  testRunning,
  testSame,
  testSkipped,
  testUpdated,
  testWorse
} from '../../messages';
import { quote } from '../../utils';

const TASK_RUNNER_CACHE = new Map<BettererRuns, BettererTasks>();

export function getTasks(runs: BettererRuns): BettererTasks {
  if (!TASK_RUNNER_CACHE.has(runs)) {
    TASK_RUNNER_CACHE.set(
      runs,
      runs.map((run) => ({
        name: run.name,
        run: async (logger: BettererLogger) => {
          const name = quote(run.name);
          if (run.isExpired) {
            await logger.warn(testExpired(name));
          }
          await logger.progress(testRunning(name));

          await run.lifecycle;

          const { progress } = run;
          if (run.isComplete) {
            return testComplete(name, run.isNew);
          }
          if (run.isBetter) {
            return testBetter(name, progress);
          }
          if (run.isFailed) {
            throw new BettererError(testFailed(name));
          }
          if (run.isNew) {
            return testNew(name, progress);
          }
          if (run.isSkipped) {
            return testSkipped(name, progress);
          }
          if (run.isSame) {
            return testSame(name, progress);
          }
          if (run.isUpdated) {
            await run.diff.log(logger);
            return testUpdated(name, progress);
          }
          if (run.isWorse) {
            await run.diff.log(logger);
            throw new BettererError(testWorse(name, progress));
          }
          return;
        }
      }))
    );
  }
  return TASK_RUNNER_CACHE.get(runs) as BettererTasks;
}
