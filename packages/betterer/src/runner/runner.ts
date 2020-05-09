import { ConstraintResult } from '@betterer/constraints';
import { logError } from '@betterer/errors';

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
  const timestamp = Date.now();
  let current: unknown;
  try {
    current = await test.test(run);
  } catch (e) {
    run.failed();
    process.stderr.write(JSON.stringify(e));
    logError(e);
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
    run.same();
    return;
  }

  if (comparison === ConstraintResult.better) {
    run.better(current, goalComplete, timestamp);
    return;
  }

  run.worse(current);
  return;
}
