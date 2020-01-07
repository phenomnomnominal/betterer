import { CONSTRAINT_FUNCTION_REQUIRED, TEST_FUNCTION_REQUIRED } from '../errors';
import { Betterer, isBetterer, BettererOptions } from './betterer';
import { SerialisableBetterer, SerialisableBettererOptions } from './serialisable-betterer';
import { Serialisable } from './types';

export function createBetterer(
  options: Betterer | BettererOptions | SerialisableBettererOptions<Serialisable<unknown>>
): Betterer {
  if (isBetterer(options)) {
    return options;
  }

  const { constraint, test } = options;
  if (constraint == null) {
    throw CONSTRAINT_FUNCTION_REQUIRED();
  }
  if (test == null) {
    throw TEST_FUNCTION_REQUIRED();
  }

  if (isSerialisableBettererOptions(options)) {
    return new SerialisableBetterer(options) as Betterer;
  }
  return new Betterer(options);
}

function isSerialisableBettererOptions(
  options: unknown
): options is SerialisableBettererOptions<Serialisable<unknown>> {
  return !!(options as SerialisableBettererOptions<Serialisable<unknown>>).deserialise;
}
