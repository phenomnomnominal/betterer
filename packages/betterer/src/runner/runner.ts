import { ConstraintResult } from '@betterer/constraints';

import { Betterer } from '../betterer';
import { BettererContext, BettererRunContext } from '../context';
import { serialise } from './serialiser';

export async function parallel(context: BettererContext): Promise<void> {
  const { runs } = context;
  context.runnerStart();
  await Promise.all(
    runs.map(async run => {
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

async function runTest(
  betterer: Betterer,
  runContext: BettererRunContext
): Promise<void> {
  const { test, constraint, goal, isSkipped } = betterer;
  const { expected, hasExpected } = runContext;

  if (isSkipped) {
    runContext.skipped();
    return;
  }

  runContext.start();
  let current: unknown;
  try {
    current = await test(runContext);
  } catch {
    runContext.failed();
    return;
  }
  runContext.ran();

  const serialisedCurrent = await serialise(current);
  const goalComplete = await goal(serialisedCurrent);

  if (!hasExpected) {
    runContext.new(current, goalComplete);
    return;
  }

  const comparison = await constraint(serialisedCurrent, expected);

  if (comparison === ConstraintResult.same) {
    runContext.same(goalComplete);
    return;
  }

  if (comparison === ConstraintResult.better) {
    runContext.better(current, goalComplete);
    return;
  }

  runContext.worse(current, serialisedCurrent);
  return;
}
