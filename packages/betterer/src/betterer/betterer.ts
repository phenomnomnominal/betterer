import { BettererRun } from '../context';
import { BettererConstraint, BettererGoal, BettererTestFunction, BettererOptions } from './types';

export class Betterer<TestType = unknown, SerialisedType = TestType> {
  public readonly constraint: BettererConstraint<SerialisedType>;
  public readonly goal: BettererGoal<SerialisedType>;
  public readonly test: BettererTestFunction<TestType>;
  public readonly isBetterer = true;

  private _isOnly: boolean;
  private _isSkipped: boolean;

  constructor(options: BettererOptions<TestType, SerialisedType>) {
    const { constraint, test, isOnly, isSkipped } = options;
    this.constraint = constraint;
    this.goal = this._createGoal(options);
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

  public getExpected(run: BettererRun): SerialisedType {
    return run.test.context.expected[run.name] as SerialisedType;
  }

  public only(): this {
    this._isOnly = true;
    return this;
  }

  public skip(): this {
    this._isSkipped = true;
    return this;
  }

  private _createGoal(options: BettererOptions<TestType, SerialisedType>): BettererGoal<SerialisedType> {
    const hasGoal = Object.hasOwnProperty.call(options, 'goal');
    if (!hasGoal) {
      return (): boolean => false;
    }
    const { goal } = options;
    if (this._isGoalFunction(goal)) {
      return goal;
    }
    return (value: unknown): boolean => value === goal;
  }

  private _isGoalFunction(goal: unknown): goal is BettererGoal<unknown> {
    return typeof goal === 'function';
  }
}

export function isBetterer(obj: unknown): obj is Betterer {
  return !!(obj as Betterer).isBetterer;
}
