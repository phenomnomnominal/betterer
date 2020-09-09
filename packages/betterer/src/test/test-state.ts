import { BettererTestConfig } from './types';

const IS_BETTERER_TEST = 'isBettererTest';

export class BettererTestState {
  public readonly isBettererTest = IS_BETTERER_TEST;

  private _isOnly = false;
  private _isSkipped = false;

  constructor(private _config: BettererTestConfig) {}

  public get config(): BettererTestConfig {
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

export function isBettererTest(test: unknown): test is BettererTestState {
  return (test as BettererTestState)?.isBettererTest === IS_BETTERER_TEST;
}
