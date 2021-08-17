import { createTestConfig } from './config';
import {
  BettererTestBase,
  BettererTestConfig,
  BettererTestConstraint,
  BettererTestGoal,
  BettererTestOptions
} from './types';

export class BettererTest<DeserialisedType, SerialisedType = DeserialisedType, DiffType = null>
  implements BettererTestBase<DeserialisedType, SerialisedType, DiffType>
{
  public readonly config: BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;

  private _isOnly = false;
  private _isSkipped = false;

  constructor(options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>) {
    this.config = createTestConfig(options) as BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  }

  public get isOnly(): boolean {
    return this._isOnly;
  }

  public get isSkipped(): boolean {
    return this._isSkipped;
  }

  public constraint(constraintOverride: BettererTestConstraint<DeserialisedType>): this {
    this.config.constraint = constraintOverride;
    return this;
  }

  public goal(goalOverride: BettererTestGoal<DeserialisedType>): this {
    this.config.goal = goalOverride;
    return this;
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

export function isBettererTest(test: unknown): test is BettererTestBase {
  return !!test && (test as BettererTestBase).constructor.name === BettererTest.name;
}
