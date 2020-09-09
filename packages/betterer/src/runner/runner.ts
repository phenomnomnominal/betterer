import { BettererConstraintResult } from '@betterer/constraints';
import { logErrorΔ } from '@betterer/errors';

import { BettererContextΩ, BettererRun, BettererRunΩ, BettererSummary } from '../context';
import { BettererFilePaths } from '../watcher';
import { BettererResultΩ } from '../results';

export async function parallel(context: BettererContextΩ, filePaths: BettererFilePaths): Promise<BettererSummary> {
  return context.start(async (runs) => {
    await Promise.all(
      runs.map(async (run) => {
        const runΩ = run as BettererRunΩ;
        await runTest(runΩ, context.config.update);
        runΩ.end();
      })
    );
  }, filePaths);
}

export async function serial(context: BettererContextΩ): Promise<BettererSummary> {
  return context.start(async (runs) => {
    await runs.reduce(async (p, run) => {
      await p;
      const runΩ = run as BettererRunΩ;
      await runTest(runΩ, context.config.update);
      runΩ.end();
    }, Promise.resolve());
  });
}

async function runTest(run: BettererRun, update: boolean): Promise<void> {
  const runΩ = run as BettererRunΩ;
  const { test } = runΩ;

  if (run.isSkipped) {
    return;
  }

  runΩ.start();
  let result: BettererResultΩ;
  try {
    result = new BettererResultΩ(await test.test(runΩ));
  } catch (e) {
    runΩ.failed();
    logErrorΔ(e);
    return;
  }
  runΩ.ran();

  const goalComplete = await test.goal(result.value);

  if (runΩ.isNew) {
    runΩ.new(result, goalComplete);
    return;
  }

  const comparison = await test.constraint(result.value, runΩ.expected.value);

  if (comparison === BettererConstraintResult.same) {
    runΩ.same(result);
    return;
  }

  if (comparison === BettererConstraintResult.better) {
    runΩ.better(result, goalComplete);
    return;
  }

  if (update) {
    runΩ.update(result);
    return;
  }

  runΩ.worse(result);
  return;
}
