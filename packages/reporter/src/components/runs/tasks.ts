import { BettererRun, BettererRunSummary } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { BettererLogger, BettererLoggerCodeInfo, BettererLoggerMessage, BettererLogs } from '@betterer/logger';
import { BettererTaskRun, getTask } from '@betterer/tasks';

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
import { BettererReporterRun } from '../../types';
import { quote } from '../../utils';
import { getDelta } from './deltas';

export function useTask(run: BettererRun | BettererRunSummary): BettererTaskRun {
  return (
    getTask(run.name) ||
    (async (logger: BettererLogger) => {
      const name = quote(run.name);
      await logger.progress(testRunning(name));

      const runSummary = await (run as BettererReporterRun).lifecycle;

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
        await handleLogs(runSummary.diff.logs, logger);
        return testUpdated(name, delta);
      }
      if (runSummary.isWorse) {
        await handleLogs(runSummary.diff.logs, logger);
        throw new BettererError(testWorse(name, delta));
      }
      return;
    })
  );
}

async function handleLogs(logs: BettererLogs, logger: BettererLogger): Promise<void> {
  await Promise.all(
    logs.map((log) => {
      const types = Object.keys(log) as Array<keyof BettererLogger>;
      return types.map((type) => logger[type](log[type] as BettererLoggerCodeInfo & BettererLoggerMessage));
    })
  );
}
