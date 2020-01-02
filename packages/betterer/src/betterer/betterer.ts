import {
  BettererConstraint,
  BettererGoal,
  BettererGoalFunction,
  BettererTest,
  BettererOptions
} from './types';

export class Betterer<TestType = unknown, SerialisedType = TestType> {
  public readonly constraint: BettererConstraint<SerialisedType>;
  public readonly goal: BettererGoalFunction<SerialisedType>;
  public readonly test: BettererTest<TestType>;
  public readonly isBetterer = true;

  private _isOnly = false;
  private _isSkipped = false;

  constructor(options: BettererOptions<TestType, SerialisedType>) {
    const { constraint, goal, test, isOnly, isSkipped } = options;
    this.constraint = constraint;
    this.goal = createGoal(goal);
    this.test = test;
    this._isOnly = isOnly || false;
    this._isSkipped = isSkipped || false;
  }

  public get isOnly(): boolean {
    return this._isOnly;
  }

  public get isSkipped(): boolean {
    return this._isSkipped;
  }

  public only(): this {
    this._isOnly = true;
    return this;
  }

  public skip(): this {
    this._isSkipped = true;
    return this;
  }
}

function createGoal<SerialisedType>(
  goal: BettererGoal<SerialisedType>
): BettererGoalFunction<SerialisedType> {
  if (isGoalFunction(goal)) {
    return goal;
  }
  return (value: unknown): boolean => value === goal;
}

function isGoalFunction(goal: unknown): goal is BettererGoalFunction<unknown> {
  return typeof goal === 'function';
}

export function isBetterer(obj: unknown): obj is Betterer {
  return !!(obj as Betterer).isBetterer;
}
