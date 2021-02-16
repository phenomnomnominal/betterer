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

          const { delta } = run;
          if (run.isComplete) {
            return testComplete(name, run.isNew);
          }
          if (run.isBetter) {
            return testBetter(name, delta);
          }
          if (run.isFailed) {
            throw new BettererError(testFailed(name));
          }
          if (run.isNew) {
            return testNew(name, delta);
          }
          if (run.isSkipped) {
            return testSkipped(name, delta);
          }
          if (run.isSame) {
            return testSame(name, delta);
          }
          if (run.isUpdated) {
            await run.diff.log(logger);
            return testUpdated(name, delta);
          }
          if (run.isWorse) {
            await run.diff.log(logger);
            throw new BettererError(testWorse(name, delta));
          }
          return;
        }
      }))
    );
  }
  return TASK_RUNNER_CACHE.get(runs) as BettererTasks;
}
