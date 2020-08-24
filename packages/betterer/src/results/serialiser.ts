import { BettererRunΩ } from '../context';

export function serialise(run: BettererRunΩ): unknown {
  const { test, toPrint } = run;
  const serialiser = test.serialiser?.serialise || defaultSerialiser;
  return serialiser(toPrint);
}

function defaultSerialiser(result: unknown): unknown {
  return result;
}
