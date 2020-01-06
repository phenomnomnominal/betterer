import { ConstraintResult } from '@betterer/constraints';

import { BettererFilePaths } from '../betterer';
import { BettererContext, BettererRun, BettererRuns } from '../context';

export async function parallel(context: BettererContext, files: BettererFilePaths = []): Promise<BettererRuns> {
  const runs = context.getRuns(files);
  context.runnerStart(files);
  await Promise.all(
    runs.map(async run => {
      await runTest(run);
      run.end();
    })
  );
  context.runnerEnd(runs, files);
  return runs;
}

export async function serial(context: BettererContext): Promise<BettererRuns> {
  const runs = context.getRuns();
  context.runnerStart();
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
  const { betterer } = test;

  if (betterer.isSkipped) {
    run.skipped();
    return;
  }

  run.start();
  let current: unknown;
  try {
    current = await betterer.test(run);
  } catch {
    run.failed();
    return;
  }
  run.ran();

  const goalComplete = await betterer.goal(current);

  if (run.isNew) {
    run.new(current, goalComplete);
    return;
  }

  const comparison = await betterer.constraint(current, run.expected);

  if (comparison === ConstraintResult.same) {
    run.same(goalComplete);
    return;
  }

  if (comparison === ConstraintResult.better) {
    run.better(current, goalComplete);
    return;
  }

  run.worse(current);
  return;
}
