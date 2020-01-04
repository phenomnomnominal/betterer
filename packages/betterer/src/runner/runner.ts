import { ConstraintResult } from '@betterer/constraints';

import {
  BettererContext,
  BettererRun,
  BettererTest,
  BettererRuns
} from '../context';
import { BettererFilePaths } from '../files';
import { serialise } from './serialiser';

export async function parallel(
  context: BettererContext,
  files: BettererFilePaths = []
): Promise<BettererRuns> {
  const runs = context.getRuns(files);
  context.runnerStart();
  await Promise.all(
    runs.map(async run => {
      await runTest(run.test, run);
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
    await runTest(run.test, run);
    run.end();
  }, Promise.resolve());
  context.runnerEnd(runs);
  return runs;
}

async function runTest(test: BettererTest, run: BettererRun): Promise<void> {
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

  const serialisedCurrent = await serialise(current);
  const goalComplete = await betterer.goal(serialisedCurrent);

  if (!run.hasExpected) {
    run.new(current, goalComplete);
    return;
  }

  const comparison = await betterer.constraint(serialisedCurrent, run.expected);

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
