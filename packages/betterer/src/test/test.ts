import { CONSTRAINT_FUNCTION_REQUIRED, TEST_FUNCTION_REQUIRED } from '../errors';
import { isFunction } from '../utils';
import {
  BettererTestOptions,
  BettererTestConstraint,
  BettererTestGoal,
  BettererTestFunction,
  BettererDiffer,
  BettererPrinter,
  BettererSerialiser
} from './types';
import { BettererTestState } from './test-state';

const IS_BETTERER_TEST = 'isBettererTest';

export class BettererTest<
  DeserialisedType = unknown,
  SerialisedType = DeserialisedType,
  DiffType = null
> extends BettererTestState {
  public readonly constraint: BettererTestConstraint<DeserialisedType>;
  public readonly goal: BettererTestGoal<DeserialisedType>;
  public readonly test: BettererTestFunction<DeserialisedType>;
  public readonly deadline: number;

  public readonly differ?: BettererDiffer<DeserialisedType, DiffType>;
  public readonly printer?: BettererPrinter<SerialisedType>;
  public readonly serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;

  public readonly isBettererTest = IS_BETTERER_TEST;

  constructor(options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>) {
    super(options.isSkipped, options.isOnly);

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
