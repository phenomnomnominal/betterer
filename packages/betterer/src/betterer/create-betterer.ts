import { NO_CONSTRAINT, NO_TEST } from '../errors';
import { Betterer, isBetterer } from './betterer';
import { BettererOptions } from './types';

export function createBetterer<TestType = unknown, SerialisedType = TestType>(
  betterer:
    | BettererOptions<TestType, SerialisedType>
    | Betterer<TestType, SerialisedType>
): Betterer<TestType, SerialisedType> {
  if (isBetterer(betterer)) {
    return betterer;
  }

  const { constraint, test } = betterer;
  if (constraint == null) {
    throw NO_CONSTRAINT();
  }
  if (test == null) {
    throw NO_TEST();
  }
  return new Betterer<TestType, SerialisedType>(betterer);
}
