import { BettererResult } from './types';

const NO_PREVIOUS_RESULT = Symbol('No Previous Result');

export class BettererResultΩ implements BettererResult {
  public readonly isNew: boolean;

  public readonly value: unknown | null = null;

  constructor(value: unknown | typeof NO_PREVIOUS_RESULT = NO_PREVIOUS_RESULT) {
    this.isNew = value === NO_PREVIOUS_RESULT;
    if (value !== NO_PREVIOUS_RESULT) {
      this.value = value;
    }
  }
}
