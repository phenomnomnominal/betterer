import assert from 'assert';

import { BettererResult } from './types';

const NO_PREVIOUS_RESULT = Symbol('No Previous Result');

export class BettererResultΩ implements BettererResult {
  private readonly _isNew: boolean;
  private readonly _value: unknown | null = null;

  constructor(value: unknown | typeof NO_PREVIOUS_RESULT = NO_PREVIOUS_RESULT) {
    this._isNew = value === NO_PREVIOUS_RESULT;
    if (value !== NO_PREVIOUS_RESULT) {
      this._value = value;
    }
  }

  public get isNew(): boolean {
    return this._isNew;
  }

  public get value(): unknown {
    assert(this._value !== null);
    return this._value;
  }
}
