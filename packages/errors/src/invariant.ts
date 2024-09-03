import assert from 'assert';

import { BettererError } from './error.js';

export function invariant(value: unknown, message: `${string}!`, ...values: Array<unknown>): asserts value {
  assert(value, new BettererError(`${message} 🤔`, ...values.map((value) => JSON.stringify(value))));
}
