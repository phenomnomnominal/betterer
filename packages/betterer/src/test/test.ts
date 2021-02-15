import { createTestConfig } from './config';
import { BettererTestBase, BettererTestConfig, BettererTestConfigPartial } from './types';

const IS_BETTERER_TEST = 'isBettererTest';

export class BettererTest<DeserialisedType, SerialisedType, DiffType>
  implements BettererTestBase<DeserialisedType, SerialisedType, DiffType> {
  public readonly isBettererTest = IS_BETTERER_TEST;

  private _config: BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  private _isOnly = false;
  private _isSkipped = false;

  constructor(config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>) {
    this._config = createTestConfig(config) as BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
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
  return (test as BettererTestBase)?.isBettererTest === IS_BETTERER_TEST;
}
