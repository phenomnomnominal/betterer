import { BettererRunΩ } from '../context';

export function serialise(run: BettererRunΩ): unknown {
  const { test, toPrint } = run;
  const serialiser = test.serialiser?.serialise || defaultSerialiser;
  return serialiser(run, toPrint);
}

function defaultSerialiser(_: BettererRunΩ, result: unknown): unknown {
  return result;
}
