import * as assert from 'assert';

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

export class BettererTest<DeserialisedType = unknown, SerialisedType = DeserialisedType> extends BettererTestState {
  public readonly constraint: BettererTestConstraint<DeserialisedType>;
  public readonly goal: BettererTestGoal<DeserialisedType>;
  public readonly test: BettererTestFunction<DeserialisedType>;

  public differ?: BettererDiffer;
  public printer?: BettererPrinter<SerialisedType>;
  public serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;

  public isBettererTest = IS_BETTERER_TEST;

  private _name: string | null = null;

  constructor(options: BettererTestOptions<DeserialisedType, SerialisedType>) {
    super(options.isSkipped, options.isOnly);

    if (options.constraint == null) {
      throw CONSTRAINT_FUNCTION_REQUIRED();
    }
    if (options.test == null) {
      throw TEST_FUNCTION_REQUIRED();
    }

    this.constraint = options.constraint;
    this.goal = this._createGoal(options);
    this.test = options.test;

    this.differ = options.differ;
    this.printer = options.printer;
    this.serialiser = options.serialiser;
  }

  public setName(name: string): void {
    this._name = name;
  }

  public get name(): string {
    assert.notEqual(this._name, null);
    return this._name as string;
  }

  private _createGoal(
    options: BettererTestOptions<DeserialisedType, SerialisedType>
  ): BettererTestGoal<DeserialisedType> {
    const hasGoal = Object.hasOwnProperty.call(options, 'goal');
    if (!hasGoal) {
      return (): boolean => false;
    }
    const { goal } = options;
    if (isFunction(goal)) {
      return goal;
    }
    return (value: unknown): boolean => value === goal;
  }
}

export function isBettererTest(test: unknown): test is BettererTest {
  return (test as BettererTest)?.isBettererTest === IS_BETTERER_TEST;
}
