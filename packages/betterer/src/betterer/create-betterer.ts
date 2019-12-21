import { Betterer, BettererOptions } from './betterer';

export function createBetterer<Base = unknown, Serialised = Base>(
  betterer: BettererOptions<Base, Serialised>
): Betterer<Base, Serialised> {
  if (betterer instanceof Betterer) {
    return betterer;
  }

  const { test, constraint } = betterer;
  if (test == null) {
    throw new Error();
  }
  if (constraint == null) {
    throw new Error();
  }
  return new Betterer<Base, Serialised>(betterer);
}
