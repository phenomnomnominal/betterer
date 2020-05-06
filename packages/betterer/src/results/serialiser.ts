import { BettererRun } from '../context';

export function serialise(run: BettererRun): unknown {
    const { test, toPrint } = run;
    const serialiser = test.serialiser?.serialise || defaultSerialiser;
    return serialiser(toPrint);
}

function defaultSerialiser(result: unknown): unknown {
    return result;
}
