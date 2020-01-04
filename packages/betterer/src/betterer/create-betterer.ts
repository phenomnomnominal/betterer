import { NO_CONSTRAINT, NO_TEST } from '../errors';
import { Betterer, isBetterer } from './betterer';
import { BettererOptions } from './types';

export function createBetterer(options: BettererOptions | Betterer): Betterer {
  if (isBetterer(options)) {
    return options;
  }

  const { constraint, test } = options;
  if (constraint == null) {
    throw NO_CONSTRAINT();
  }
  if (test == null) {
    throw NO_TEST();
  }
  return new Betterer(options);
}
