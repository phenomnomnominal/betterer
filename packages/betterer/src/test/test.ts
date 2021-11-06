import { createDeadline, createGoal, createTestConfig } from './config';
import {
  BettererTestBase,
  BettererTestConfig,
  BettererTestConstraint,
  BettererTestDeadline,
  BettererTestGoal,
  BettererTestOptions
} from './types';

/**
 * @public
 */
export class BettererTest<DeserialisedType, SerialisedType = DeserialisedType, DiffType = null>
  implements BettererTestBase<DeserialisedType, SerialisedType, DiffType>
{
  /**
   * The complete configuration for the test.
   */
  public readonly config: BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;

  private _isOnly = false;
  private _isSkipped = false;

  constructor(options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>) {
    this.config = createTestConfig(options) as BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  }

  /**
   * When `true`, all other tests will be skipped. Calling `only()` will set this to `true`.
   */
  public get isOnly(): boolean {
    return this._isOnly;
  }

  /**
   * When `true`, this test will be skipped. Calling `skip()` will set this to `true`.
   */
  public get isSkipped(): boolean {
    return this._isSkipped;
  }

  /**
   * Override the constraint in the test configuration.
   *
   * @param constraintOverride the new constraint for the test.
   * @returns this test, so it is chainable.
   */
  public constraint(constraintOverride: BettererTestConstraint<DeserialisedType>): this {
    this.config.constraint = constraintOverride;
    return this;
  }

  /**
   * Override the deadline in the test configuration.
   *
   * @param deadlineOverride the new deadline for the test.
   * @returns this test, so it is chainable.
   */
  public deadline(deadlineOverride: BettererTestDeadline): this {
    this.config.deadline = createDeadline({ ...this.config, deadline: deadlineOverride });
    return this;
  }

  /**
   * Override the goal in the test configuration.
   *
   * @param goalOverride the new goal for the test.
   * @returns this test, so it is chainable.
   */
  public goal(goalOverride: BettererTestGoal<DeserialisedType>): this {
    this.config.goal = createGoal({ ...this.config, goal: goalOverride });
    return this;
  }

  /**
   * Run only this test. All other tests will be marked as skipped.
   *
   * @returns this test, so it is chainable.
   */
  public only(): this {
    this._isOnly = true;
    return this;
  }

  /**
   * Skip this test.
   *
   * @returns this test, so it is chainable.
   */
  public skip(): this {
    this._isSkipped = true;
    return this;
  }
}

export function isBettererTest(test: unknown): test is BettererTestBase {
  return !!test && (test as BettererTestBase).constructor.name === BettererTest.name;
}
