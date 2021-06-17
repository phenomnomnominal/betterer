import { BettererRun } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { BettererLogger } from '@betterer/logger';
import { BettererTaskRun } from '@betterer/tasks';
import { useCallback } from 'react';

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
import { getDelta } from './deltas';

export function useTask(run: BettererRun): BettererTaskRun {
  return useCallback(async (logger: BettererLogger) => {
    const name = quote(run.name);
    await logger.progress(testRunning(name));

    const runSummary = await run.lifecycle;

    if (runSummary.isExpired) {
      await logger.warn(testExpired(name));
    }

    const delta = getDelta(runSummary);

    if (runSummary.isComplete) {
      return testComplete(name, runSummary.isNew);
    }
    if (runSummary.isBetter) {
      return testBetter(name, delta);
    }
    if (runSummary.isFailed) {
      throw new BettererError(testFailed(name));
    }
    if (runSummary.isNew) {
      return testNew(name, delta);
    }
    if (runSummary.isSkipped) {
      return testSkipped(name, delta);
    }
    if (runSummary.isSame) {
      return testSame(name, delta);
    }
    if (runSummary.isUpdated) {
      await runSummary.diff.log(logger);
      return testUpdated(name, delta);
    }
    if (runSummary.isWorse) {
      await runSummary.diff.log(logger);
      throw new BettererError(testWorse(name, delta));
    }
    return;
  }, []);
}
