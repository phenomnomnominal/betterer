import { bigger } from '@betterer/constraints/src';

let start = 0;

export default {
  'gets better': {
    test: () => start++,
    constraint: bigger
  }
};
