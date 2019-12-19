import * as logDiff from 'jest-diff';

import { Betterer, BettererGoal, BettererGoalFunction } from './types';

export function createTest(
  betterer: Partial<Betterer<unknown>>
): Betterer<unknown> {
  if (betterer.test == null) {
    throw new Error();
  }
  if (betterer.constraint == null) {
    throw new Error();
  }
  return {
    test: betterer.test,
    constraint: betterer.constraint,
    goal: createGoal(betterer.goal),
    diff: betterer.diff || defaultDiff,
    skip: false,
    only: false
  };
}

function defaultDiff(
  _: unknown,
  serialisedCurrent: unknown,
  serialisedPrevious: unknown
): void {
  const diffStr =
    logDiff(serialisedPrevious, serialisedCurrent, {
      aAnnotation: 'Previous',
      bAnnotation: 'Current'
    }) || '';
  console.log(
    diffStr
      .split('\n')
      .map(line => `  ${line}`)
      .join('\n')
  );
}

function createGoal(
  goal: BettererGoal<unknown>
): BettererGoalFunction<unknown> {
  if (typeof goal === 'function') {
    return goal as BettererGoalFunction<unknown>;
  }
  return (value: unknown): boolean => value === goal;
}
