import type { BettererRun } from '@betterer/betterer';
import type { BettererLogger } from '@betterer/logger';
import type { BettererTask } from '@betterer/tasks';

import type { BettererReporterRun } from '../../types.js';

import { BettererError } from '@betterer/errors';
import { logΔ } from '@betterer/logger';

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
} from '../../messages.js';
import { quote } from '../../utils.js';
import { getDelta } from './deltas/index.js';

const TASKS = new Map<BettererRun, BettererTask>();

export function useTask(run: BettererRun): BettererTask {
  const existingTask = TASKS.get(run);
  if (existingTask) {
    return existingTask;
  }

  const task = async (logger: BettererLogger) => {
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
    if (runSummary.isUpdated && runSummary.diff) {
      await logΔ(runSummary.diff.logs, logger);
      return testUpdated(name, delta);
    }
    if (runSummary.isWorse && runSummary.diff) {
      await logΔ(runSummary.diff.logs, logger);
      throw new BettererError(testWorse(name, delta));
    }
    return;
  };
  TASKS.set(run, task);
  return task;
}
