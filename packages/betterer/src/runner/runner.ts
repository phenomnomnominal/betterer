import { ConstraintResult } from '@betterer/constraints';

import { Betterer } from '../betterer';
import { BettererContext, BettererRun } from '../context';
import { serialise } from './serialiser';

export async function parallel(
  context: BettererContext,
  files: ReadonlyArray<string> = []
): Promise<void> {
  const { runs } = context;
  context.runnerStart();
  await Promise.all(
    runs.map(async run => {
      run.setFiles(files);
      await runTest(run.betterer, run);
      run.end();
    })
  );
  context.runnerEnd();
}

export async function serial(context: BettererContext): Promise<void> {
  const { runs } = context;
  context.runnerStart();
  await runs.reduce(async (p, run) => {
    await p;
    await runTest(run.betterer, run);
    run.end();
  }, Promise.resolve());
  context.runnerEnd();
}

async function runTest(betterer: Betterer, run: BettererRun): Promise<void> {
  const { test, constraint, goal, isSkipped } = betterer;
  const { expected, hasExpected } = run;

  if (isSkipped) {
    run.skipped();
    return;
  }

  run.start();
  let current: unknown;
  try {
    current = await test(run);
  } catch {
    run.failed();
    return;
  }
  run.ran();

  const serialisedCurrent = await serialise(current);
  const goalComplete = await goal(serialisedCurrent);

  if (!hasExpected) {
    run.new(current, goalComplete);
    return;
  }

  const comparison = await constraint(serialisedCurrent, expected);

  if (comparison === ConstraintResult.same) {
    run.same(goalComplete);
    return;
  }

  if (comparison === ConstraintResult.better) {
    run.better(current, goalComplete);
    return;
  }

  run.worse(current, serialisedCurrent);
  return;
}
