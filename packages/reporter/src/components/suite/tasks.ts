import type { BettererDiff, BettererRun } from '@betterer/betterer';
import type { BettererLogger } from '@betterer/logger';
import type { BettererTask } from '@betterer/tasks';

import type { BettererReporterRun } from '../../types.js';

import { BettererError, invariantΔ } from '@betterer/errors';
import { diffΔ } from '@betterer/logger';

import {
  testBetter,
  testComplete,
  testExpired,
  testFailed,
  testNew,
  testObsolete,
  testRemoved,
  testRunning,
  testSame,
  testSkipped,
  testUpdated,
  testWorse
} from '../../messages.js';
import { quote } from '../../utils.js';
import { getDelta } from './deltas/index.js';
import { useCallback } from '@betterer/render';

const DIFF_OPTIONS = {
  aAnnotation: 'Expected',
  bAnnotation: 'Result'
};

export function useTask(run: BettererRun): BettererTask {
  return useCallback(
    async (logger: BettererLogger, status: BettererLogger) => {
      const name = quote(run.name);
      await status.progress(testRunning(name));

      const runSummary = await (run as BettererReporterRun).lifecycle.promise;

      if (runSummary.isExpired) {
        await logger.warn(testExpired(name));
      }

      const delta = getDelta(runSummary);

      if (runSummary.isComplete) {
        return testComplete(name, runSummary.isSame);
      }
      if (runSummary.isBetter) {
        return testBetter(name, delta);
      }
      if (runSummary.isFailed) {
        invariantΔ(runSummary.error, 'A failed run will always have an `error`!');
        throw new BettererError(testFailed(name), runSummary.error);
      }
      if (runSummary.isNew) {
        return testNew(name, delta);
      }
      if (runSummary.isObsolete && !runSummary.isRemoved) {
        return testObsolete(name);
      }
      if (runSummary.isRemoved) {
        return testRemoved(name);
      }
      if (runSummary.isSkipped) {
        return testSkipped(name, delta);
      }
      if (runSummary.isSame) {
        return testSame(name, delta);
      }
      const { diff, expected, result } = runSummary;
      if ((diff as BettererDiff<unknown>).diff === null && expected && result) {
        const diffStr = diffΔ(expected.value, result.value, DIFF_OPTIONS);
        if (diffStr) {
          await logger.error(diffStr);
        }
      }
      if (runSummary.isWorse && !runSummary.isUpdated) {
        throw new BettererError(testWorse(name, delta));
      }
      if (runSummary.isUpdated) {
        return testUpdated(name, delta);
      }
      return;
    },
    [run]
  );
}
