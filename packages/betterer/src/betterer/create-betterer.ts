import { Betterer, BettererOptions } from './betterer';
import { NO_CONSTRAINT, NO_TEST } from '../errors';

export function createBetterer<Base = unknown, Serialised = Base>(
  betterer: BettererOptions<Base, Serialised>
): Betterer<Base, Serialised> {
  if (betterer instanceof Betterer) {
    return betterer;
  }

  const { test, constraint } = betterer;
  if (test == null) {
    throw NO_TEST();
  }
  if (constraint == null) {
    throw NO_CONSTRAINT;
  }
  return new Betterer<Base, Serialised>(betterer);
}
