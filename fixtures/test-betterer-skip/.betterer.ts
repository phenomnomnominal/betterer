import { bigger } from '@betterer/constraints';
import { regexpBetterer } from '@betterer/regexp';

let start = 0;

export default {
  'test 1': {
    test: () => start++,
    constraint: bigger
  },
  'test 2': regexpBetterer('./src/**/*.ts', /(\/\/\s*HACK)/i)
};
