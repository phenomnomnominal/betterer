import assert from 'assert';

import { BettererResult, BettererResultValue, BettererResultValueComplex } from './types';

const NO_PREVIOUS_RESULT = Symbol('No Previous Result');

export class BettererResultΩ implements BettererResult {
  private readonly _isNew: boolean;
  private readonly _result: BettererResultValue | null = null;

  constructor(result: BettererResultValue | typeof NO_PREVIOUS_RESULT = NO_PREVIOUS_RESULT) {
    this._isNew = result === NO_PREVIOUS_RESULT;
    if (result !== NO_PREVIOUS_RESULT) {
      this._result = result;
    }
  }

  public get isNew(): boolean {
    return this._isNew;
  }

  public get value(): number {
    const result = this.result;
    return isComplexBettererResult(result) ? result.value : result;
  }

  public get result(): BettererResultValue {
    assert(this._result !== null);
    return this._result;
  }
}

function isComplexBettererResult(value: unknown): value is BettererResultValueComplex {
  return !!(value as BettererResultValueComplex).value;
}
