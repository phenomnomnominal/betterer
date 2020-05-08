import { bigger } from '@betterer/constraints';

let start = 0;

export const getsBetter = {
  test: () => start++,
  constraint: bigger
};
