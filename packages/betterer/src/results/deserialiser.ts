import { BettererRun } from '../context';

export function deserialise(run: BettererRun, serialised: string): unknown {
  const { test } = run;
  const parsed = JSON.parse(serialised) as unknown;
  const deserialiser = test.serialiser?.deserialise || defaultDeserialiser;
  return deserialiser(parsed);
}

function defaultDeserialiser(serialised: unknown): unknown {
  return serialised;
}
