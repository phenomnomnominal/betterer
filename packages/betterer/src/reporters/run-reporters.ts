import { br, error, info, success, warn } from '@betterer/logger';

import { BettererRunContext } from '../context';

export type BettererRunReporter = {
  better(run: BettererRunContext): void;
  end(run: BettererRunContext): void;
  failed(run: BettererRunContext): void;
  ['new'](run: BettererRunContext): void;
  same(run: BettererRunContext): void;
  start(run: BettererRunContext): void;
  worse(
    run: BettererRunContext,
    result: unknown,
    serialised: unknown,
    expected: unknown
  ): void;
};

export const runParallel: BettererRunReporter = {
  better(): void {
    //
  },
  end(): void {
    //
  },
  failed(): void {
    //
  },
  new(): void {
    //
  },
  same(): void {
    //
  },
  start(): void {
    //
  },
  worse(): void {
    //
  }
};

export const runSerial: BettererRunReporter = {
  better({ name }: BettererRunContext): void {
    success(`"${name}" got better! 😍`);
  },
  end({ hasCompleted, name }: BettererRunContext): void {
    if (!hasCompleted) {
      error(`"${name}" has not met its goal. 😔`);
      return;
    }
    success(`"${name}" has met its goal! ✨`);
  },
  failed({ name }: BettererRunContext): void {
    error(`"${name}" failed to run. 🔥`);
  },
  new({ name }: BettererRunContext): void {
    success(`"${name}" got checked for the first time! 🎉`);
  },
  same({ name }: BettererRunContext): void {
    warn(`"${name}" stayed the same. 😐`);
  },
  start({ name }: BettererRunContext): void {
    info(`running "${name}"!`);
  },
  worse(
    { name, betterer }: BettererRunContext,
    result: unknown,
    serialised: unknown,
    expected: unknown
  ): void {
    error(`"${name}" got worse. 🤬`);
    br();
    betterer.diff(result, serialised, expected);
    br();
  }
};
