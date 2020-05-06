import { bigger } from '@betterer/constraints/src';
import { regexpBetterer } from '@betterer/regexp/src';

let start = 0;

export default {
  'test 1': {
    test: () => start++,
    constraint: bigger
  },
  'test 2': regexpBetterer('./src/**/*.ts', /(\/\/\s*HACK)/i)
};
