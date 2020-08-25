import { BettererConstraintResult } from '@betterer/constraints';
import { logErrorΔ } from '@betterer/errors';

import { BettererContextΩ, BettererRunΩ, BettererRunsΩ } from '../context';
import { BettererFilePaths } from '../watcher';
import { BettererResultΩ } from '../results';

export async function parallel(context: BettererContextΩ, files: BettererFilePaths): Promise<BettererRunsΩ> {
  const runs = await context.runnerStart(files);
  await Promise.all(
    runs.map(async (run) => {
      await runTest(run, context.config.update);
      run.end();
    })
  );
  context.runnerEnd(runs, files);
  return runs;
}

export async function serial(context: BettererContextΩ): Promise<BettererRunsΩ> {
  const runs = await context.runnerStart();
  await runs.reduce(async (p, run) => {
    await p;
    await runTest(run, context.config.update);
    run.end();
  }, Promise.resolve());
  context.runnerEnd(runs);
  return runs;
}

async function runTest(run: BettererRunΩ, update: boolean): Promise<void> {
  const { test } = run;

  if (test.isSkipped) {
    run.skipped();
    return;
  }

  run.start();
  let result: BettererResultΩ;
  try {
    result = new BettererResultΩ(await test.test(run));
  } catch (e) {
    run.failed();
    logErrorΔ(e);
    return;
  }
  run.ran();

  const goalComplete = await test.goal(result.value);

  if (run.isNew) {
    run.neww(result, goalComplete);
    return;
  }

  const comparison = await test.constraint(result.value, run.expected.value);

  if (comparison === BettererConstraintResult.same) {
    run.same(result);
    return;
  }

  if (comparison === BettererConstraintResult.better) {
    run.better(result, goalComplete);
    return;
  }

  if (update) {
    run.update(result);
    return;
  }

  run.worse(result);
  return;
}
