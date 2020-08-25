import { BettererResult } from './types';

const NO_PREVIOUS_RESULT = Symbol('No Previous Result');

export class BettererResultΩ implements BettererResult {
  private readonly _isNew: boolean;
  private readonly _value: unknown;

  constructor(value: unknown | typeof NO_PREVIOUS_RESULT = NO_PREVIOUS_RESULT) {
    this._isNew = value === NO_PREVIOUS_RESULT;
    if (!this._isNew) {
      this._value = value;
    }
  }

  public get isNew(): boolean {
    return this._isNew;
  }

  public get value(): unknown {
    return this._value;
  }
}
