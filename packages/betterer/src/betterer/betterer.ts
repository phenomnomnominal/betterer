import {
  BettererConstraintFunction,
  BettererGoal,
  BettererGoalFunction,
  BettererTestFunction,
  BettererOptions
} from './types';

export class Betterer<TestType = unknown, SerialisedType = TestType> {
  public readonly constraint: BettererConstraintFunction<SerialisedType>;
  public readonly goal: BettererGoalFunction<SerialisedType>;
  public readonly test: BettererTestFunction<TestType>;
  public readonly isBetterer = true;

  private _isOnly: boolean;
  private _isSkipped: boolean;

  constructor(options: BettererOptions<TestType, SerialisedType>) {
    const { constraint, goal, test, isOnly, isSkipped } = options;
    this.constraint = constraint;
    this.goal = this._createGoal(goal);
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

  private _createGoal<SerialisedType>(
    goal: BettererGoal<SerialisedType>
  ): BettererGoalFunction<SerialisedType> {
    if (this._isGoalFunction(goal)) {
      return goal;
    }
    return (value: unknown): boolean => value === goal;
  }

  private _isGoalFunction(
    goal: unknown
  ): goal is BettererGoalFunction<unknown> {
    return typeof goal === 'function';
  }
}

export function isBetterer(obj: unknown): obj is Betterer {
  return !!(obj as Betterer).isBetterer;
}
