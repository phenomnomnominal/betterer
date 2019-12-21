import * as logDiff from 'jest-diff';

import {
  BettererGoal,
  BettererGoalFunction,
  BettererTest,
  BettererConstraint,
  BettererDiff
} from './types';

export type BettererOptions<TestType, SerialisedType = TestType> = {
  test: BettererTest<TestType>;
  constraint: BettererConstraint<SerialisedType>;
  goal: BettererGoal<SerialisedType>;
  diff: BettererDiff<TestType, SerialisedType>;
  isOnly?: boolean;
  isSkipped?: boolean;
};

export type NamedBetterer = Betterer & { name: string };

export class Betterer<Base = unknown, Serialised = Base> {
  public constraint: BettererConstraint<Serialised>;
  public diff: BettererDiff<Base, Serialised>;
  public goal: BettererGoalFunction<Serialised>;
  public test: BettererTest<Base>;
  public isOnly = false;
  public isSkipped = false;

  constructor({
    test,
    constraint,
    goal,
    diff = defaultDiff,
    isOnly = false,
    isSkipped = false
  }: BettererOptions<Base, Serialised>) {
    this.constraint = constraint;
    this.diff = diff;
    this.goal = this._createGoal(goal);
    this.test = test;
    this.isSkipped = isSkipped;
    this.isOnly = isOnly;
  }

  public skip(): Betterer<Base, Serialised> {
    this.isSkipped = true;
    return this;
  }

  public only(): Betterer<Base, Serialised> {
    this.isOnly = true;
    return this;
  }

  private _createGoal(
    goal: BettererGoal<unknown>
  ): BettererGoalFunction<unknown> {
    if (typeof goal === 'function') {
      return goal as BettererGoalFunction<unknown>;
    }
    return (value: unknown): boolean => value === goal;
  }
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
