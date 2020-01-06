import { NO_CONSTRAINT, NO_TEST } from '../errors';
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
    throw NO_CONSTRAINT();
  }
  if (test == null) {
    throw NO_TEST();
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
