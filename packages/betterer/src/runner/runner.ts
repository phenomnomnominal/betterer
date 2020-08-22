import { BettererConstraintResult } from '@betterer/constraints';
import { logErrorΔ } from '@betterer/errors';

import { BettererContext, BettererRun, BettererRuns } from '../context';
import { BettererFilePaths } from '../watcher';

export async function parallel(context: BettererContext, files: BettererFilePaths): Promise<BettererRuns> {
  const runs = await context.runnerStart(files);
  await Promise.all(
    runs.map(async (run) => {
      await runTest(run);
      run.end();
    })
  );
  context.runnerEnd(runs, files);
  return runs;
}

export async function serial(context: BettererContext): Promise<BettererRuns> {
  const runs = await context.runnerStart();
  await runs.reduce(async (p, run) => {
    await p;
    await runTest(run);
    run.end();
  }, Promise.resolve());
  context.runnerEnd(runs);
  return runs;
}

async function runTest(run: BettererRun): Promise<void> {
  const { test } = run;

  if (test.isSkipped) {
    run.skipped();
    return;
  }

  run.start();
  let result: unknown;
  try {
    result = await test.test(run);
  } catch (e) {
    run.failed();
    logErrorΔ(e);
    return;
  }
  run.ran();

  const goalComplete = await test.goal(result);

  if (run.isNew) {
    run.neww(result, goalComplete);
    return;
  }

  const comparison = await test.constraint(result, run.expected);

  if (comparison === BettererConstraintResult.same) {
    run.same(result);
    return;
  }

  if (comparison === BettererConstraintResult.better) {
    run.better(result, goalComplete);
    return;
  }

  if (run.context.config.update) {
    run.update(result);
    return;
  }

  run.worse(result);
  return;
}
