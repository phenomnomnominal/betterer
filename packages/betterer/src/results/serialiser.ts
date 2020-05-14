import { BettererRun } from '../context';

export function serialise(run: BettererRun): unknown {
  const { test, toPrint } = run;
  const serialiser = test.serialiser?.serialise || defaultSerialiser;
  return serialiser(run, toPrint);
}

function defaultSerialiser(_: BettererRun, result: unknown): unknown {
  return result;
}
