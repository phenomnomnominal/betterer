import { BettererRun } from '../context';

export function deserialise(run: BettererRun, serialised: string): unknown {
  const { test } = run;
  const parsed = JSON.parse(serialised);
  const deserialiser = test.serialiser?.deserialise || defaultDeserialiser;
  return deserialiser(run, parsed);
}

function defaultDeserialiser(_: BettererRun, serialised: unknown): unknown {
  return serialised;
}
