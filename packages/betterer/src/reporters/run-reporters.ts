import { br, error, info, success, warn } from '@betterer/logger';

import { BettererRun } from '../context';
import { getDiff } from './diffs';
import { BettererRunReporter } from './types';

export const runSerial: BettererRunReporter = {
  better(run: BettererRun): void {
    const { hasCompleted, name } = run;
    if (hasCompleted) {
      success(`"${name}" met its goal! 🎉`);
      return;
    }
    success(`"${name}" got better! 😍`);
  },
  failed(run: BettererRun): void {
    error(`"${run.name}" failed to run. 🔥`);
  },
  new(run: BettererRun): void {
    const { hasCompleted, name } = run;
    if (hasCompleted) {
      success(`"${name}" has already met its goal! ✨`);
      return;
    }
    success(`"${name}" got checked for the first time! 🎉`);
  },
  same(run: BettererRun): void {
    const { hasCompleted, name } = run;
    if (hasCompleted) {
      success(`"${name}" has already met its goal! ✨`);
      return;
    }
    warn(`"${name}" stayed the same. 😐`);
  },
  start(run: BettererRun): void {
    info(`running "${run.name}"!`);
  },
  worse(
    run: BettererRun,
    result: unknown,
    serialised: unknown,
    expected: unknown
  ): void {
    error(`"${run.name}" got worse. 😔`);
    br();
    const diff = getDiff(run.test.betterer);
    diff(result, serialised, expected);
    br();
  }
};
