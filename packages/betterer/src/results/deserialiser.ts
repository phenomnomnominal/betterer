import { BettererTest } from '../test'

export function deserialise(test: BettererTest, serialised: string): unknown {
    const parsed = JSON.parse(serialised);
    const deserialiser = test.serialiser?.deserialise || defaultDeserialiser;
    return deserialiser(parsed);
}

function defaultDeserialiser(serialised: unknown): unknown {
    return serialised;
}
