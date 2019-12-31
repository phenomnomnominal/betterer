import * as logDiff from 'jest-diff';

import {
  BettererGoal,
  BettererGoalFunction,
  BettererTest,
  BettererConstraint,
  BettererDiff
} from './types';

export type BettererOptions<TestType, SerialisedType = TestType> = {
  name?: string;
  test: BettererTest<TestType>;
  constraint: BettererConstraint<SerialisedType>;
  goal: BettererGoal<SerialisedType>;
  diff: BettererDiff<TestType, SerialisedType>;
  isOnly?: boolean;
  isSkipped?: boolean;
};

export class Betterer<Base = unknown, Serialised = Base> {
  public readonly constraint: BettererConstraint<Serialised>;
  public readonly diff: BettererDiff<Base, Serialised>;
  public readonly goal: BettererGoalFunction<Serialised>;
  public readonly test: BettererTest<Base>;

  private _isOnly = false;
  private _isSkipped = false;

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
    this.goal = createGoal(goal);
    this.test = test;
    this._isOnly = isOnly;
    this._isSkipped = isSkipped;
  }

  public get isOnly(): boolean {
    return this._isOnly;
  }

  public get isSkipped(): boolean {
    return this._isSkipped;
  }

  public only(): Betterer<Base, Serialised> {
    this._isOnly = true;
    return this;
  }

  public skip(): Betterer<Base, Serialised> {
    this._isSkipped = true;
    return this;
  }
}

function createGoal(
  goal: BettererGoal<unknown>
): BettererGoalFunction<unknown> {
  if (isGoalFunction(goal)) {
    return goal;
  }
  return (value: unknown): boolean => value === goal;
}

function isGoalFunction(goal: unknown): goal is BettererGoalFunction<unknown> {
  return typeof goal === 'function';
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
