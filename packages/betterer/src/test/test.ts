import * as assert from 'assert';

import { CONSTRAINT_FUNCTION_REQUIRED, TEST_FUNCTION_REQUIRED } from '../errors';
import { isFunction } from '../utils';
import { BettererFilePaths } from '../watcher';
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
import { BettererContext } from '../context';

const IS_BETTERER_TEST = 'isBettererTest';

export class BettererTest<
  ResultType = unknown,
  DeserialisedType = ResultType,
  SerialisedType = ResultType
> extends BettererTestState {
  public readonly constraint: BettererTestConstraint<ResultType, DeserialisedType>;
  public readonly goal: BettererTestGoal<ResultType>;
  public readonly test: BettererTestFunction<ResultType>;

  public differ?: BettererDiffer;
  public printer?: BettererPrinter<SerialisedType>;
  public serialiser?: BettererSerialiser<ResultType, DeserialisedType, SerialisedType>;

  public isBettererTest = IS_BETTERER_TEST;

  private _name: string | null = null;

  constructor(options: BettererTestOptions<ResultType, DeserialisedType, SerialisedType>) {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getExpected(_: BettererContext, expected: DeserialisedType, __: BettererFilePaths): DeserialisedType {
    return expected;
  }

  private _createGoal(
    options: BettererTestOptions<ResultType, DeserialisedType, SerialisedType>
  ): BettererTestGoal<ResultType> {
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
