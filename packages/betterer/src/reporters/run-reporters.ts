import { br, error, info, success, warn } from '@betterer/logger';

import { BettererRun } from '../context';

export type BettererRunReporter = {
  better(run: BettererRun): void;
  failed(run: BettererRun): void;
  ['new'](run: BettererRun): void;
  same(run: BettererRun): void;
  start(run: BettererRun): void;
  worse(
    run: BettererRun,
    result: unknown,
    serialised: unknown,
    expected: unknown
  ): void;
};

export const runSerial: BettererRunReporter = {
  better({ hasCompleted, name }: BettererRun): void {
    if (hasCompleted) {
      success(`"${name}" met its goal! 🎉`);
      return;
    }
    success(`"${name}" got better! 😍`);
  },
  failed({ name }: BettererRun): void {
    error(`"${name}" failed to run. 🔥`);
  },
  new({ hasCompleted, name }: BettererRun): void {
    if (hasCompleted) {
      success(`"${name}" has already met its goal! ✨`);
      return;
    }
    success(`"${name}" got checked for the first time! 🎉`);
  },
  same({ hasCompleted, name }: BettererRun): void {
    if (hasCompleted) {
      success(`"${name}" has already met its goal! ✨`);
      return;
    }
    warn(`"${name}" stayed the same. 😐`);
  },
  start({ name }: BettererRun): void {
    info(`running "${name}"!`);
  },
  worse(
    { name, betterer }: BettererRun,
    result: unknown,
    serialised: unknown,
    expected: unknown
  ): void {
    error(`"${name}" got worse. 😔`);
    br();
    betterer.diff(result, serialised, expected);
    br();
  }
};
