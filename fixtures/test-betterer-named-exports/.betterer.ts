import { bigger } from '@betterer/constraints/src';

let start = 0;

export const getsBetter = {
  test: () => start++,
  constraint: bigger
};
