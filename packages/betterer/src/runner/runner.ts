import { BettererConstraintResult } from '@betterer/constraints';
import { logErrorΔ } from '@betterer/errors';

import { BettererContextΩ, BettererRunΩ, BettererSummary } from '../context';
import { BettererFilePaths } from '../watcher';
import { BettererResultΩ } from '../results';

export async function parallel(context: BettererContextΩ, files: BettererFilePaths): Promise<BettererSummary> {
  return context.start(async (runs) => {
    await Promise.all(
      runs.map(async (run) => {
        await runTest(run, context.config.update);
        run.end();
      })
    );
  }, files);
}

export async function serial(context: BettererContextΩ): Promise<BettererSummary> {
  return context.start(async (runs) => {
    await runs.reduce(async (p, run) => {
      await p;
      await runTest(run, context.config.update);
      run.end();
    }, Promise.resolve());
  });
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
    run.new(result, goalComplete);
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
