import { ConstraintResult } from '@betterer/constraints';

import { BettererContext, BettererRun, BettererRuns } from '../context';
import { BettererFilePaths } from '../watcher';

export async function parallel(context: BettererContext, files: BettererFilePaths = []): Promise<BettererRuns> {
  context.runnerStart(files);
  const runs = await context.getRuns(files);
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
  context.runnerStart();
  const runs = await context.getRuns();
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
  const timestamp = Date.now();
  let current: unknown;
  try {
    current = await test.test(run);
  } catch {
    run.failed();
    return;
  }
  run.ran();

  const goalComplete = await test.goal(current);

  if (run.isNew) {
    run.neww(current, goalComplete, timestamp);
    return;
  }

  const comparison = await test.constraint(current, run.expected);

  if (comparison === ConstraintResult.same) {
    run.same(goalComplete);
    return;
  }

  if (comparison === ConstraintResult.better) {
    run.better(current, goalComplete, timestamp);
    return;
  }

  run.worse(current);
  return;
}
