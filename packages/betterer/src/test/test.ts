import { createTestConfig } from './config';
import { BettererTestType } from './type';
import {
  BettererTestBase,
  BettererTestConfig,
  BettererTestConstraint,
  BettererTestGoal,
  BettererTestOptions
} from './types';

export class BettererTest<DeserialisedType, SerialisedType, DiffType>
  implements BettererTestBase<DeserialisedType, SerialisedType, DiffType> {
  private _config: BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  private _isOnly = false;
  private _isSkipped = false;

  constructor(options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>) {
    this._config = createTestConfig(options, BettererTestType.Unknown) as BettererTestConfig<
      DeserialisedType,
      SerialisedType,
      DiffType
    >;
  }

  public get config(): BettererTestConfig<DeserialisedType, SerialisedType, DiffType> {
    return this._config;
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
