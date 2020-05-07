import { bigger } from '@betterer/constraints';
import { regexpBetterer } from '@betterer/regexp';

export default {
  'test 1': {
    test: () => Date.now(),
    constraint: bigger
  },
  'test 2': {
    test: () => Date.now(),
    constraint: bigger
  },
  'test 3': {
    test: () => Date.now(),
    constraint: bigger
  },
  'test 4': regexpBetterer('./src/**/*.ts', /(\/\/\s*HACK)/i)
};
