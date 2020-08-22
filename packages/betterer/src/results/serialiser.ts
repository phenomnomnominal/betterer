import { BettererRunΔ } from '../context';

export function serialise(run: BettererRunΔ): unknown {
  const { test, toPrint } = run;
  const serialiser = test.serialiser?.serialise || defaultSerialiser;
  return serialiser(run, toPrint);
}

function defaultSerialiser(_: BettererRunΔ, result: unknown): unknown {
  return result;
}
