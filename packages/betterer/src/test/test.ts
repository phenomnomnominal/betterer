import { CONSTRAINT_FUNCTION_REQUIRED, TEST_FUNCTION_REQUIRED } from '../errors';
import { isFunction } from '../utils';
import {
  BettererDiffer,
  BettererPrinter,
  BettererSerialiser,
  BettererTestConstraint,
  BettererTestFunction,
  BettererTestGoal,
  BettererTestOptions
} from './types';

const IS_BETTERER_TEST = 'isBettererTest';

export class BettererTest<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = unknown> {
  public readonly constraint: BettererTestConstraint<DeserialisedType>;
  public readonly goal: BettererTestGoal<DeserialisedType>;
  public readonly test: BettererTestFunction<DeserialisedType>;
  public readonly deadline: number;

  public readonly differ?: BettererDiffer<DeserialisedType, DiffType>;
  public readonly printer?: BettererPrinter<SerialisedType>;
  public readonly serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;

  public readonly isBettererTest = IS_BETTERER_TEST;

  private _isOnly = false;
  private _isSkipped = false;

  constructor(options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>) {
    if (options.constraint == null) {
      throw CONSTRAINT_FUNCTION_REQUIRED();
    }
    if (options.test == null) {
      throw TEST_FUNCTION_REQUIRED();
    }

    this.constraint = options.constraint;
    this.goal = this._createGoal(options);
    this.deadline = this._createDeadline(options);
    this.test = options.test;

    this.differ = options.differ;
    this.printer = options.printer;
    this.serialiser = options.serialiser;
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

  private _createDeadline(options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>): number {
    const { deadline } = options;
    if (deadline == null) {
      return Infinity;
    }
    const maybeDate = new Date(deadline).getTime();
    return !isNaN(maybeDate) ? maybeDate : Infinity;
  }

  private _createGoal(
    options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>
  ): BettererTestGoal<DeserialisedType> {
    const hasGoal = Object.hasOwnProperty.call(options, 'goal');
    if (!hasGoal) {
      return (): boolean => false;
    }
    const { goal } = options;
    if (isFunction<BettererTestGoal<DeserialisedType>>(goal)) {
      return goal;
    }
    return (value: unknown): boolean => value === goal;
  }
}

export function isBettererTest(test: unknown): test is BettererTest {
  return (test as BettererTest)?.isBettererTest === IS_BETTERER_TEST;
}
