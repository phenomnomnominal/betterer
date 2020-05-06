import { bigger } from '@betterer/constraints/src';
import { regexpBetterer } from '@betterer/regexp/src';

export default {
  'test 1': {
    test: () => Date.now(),
    constraint: bigger,
    isOnly: true
  },
  'test 2': {
    test: () => Date.now(),
    constraint: bigger
  },
  'test 3': {
    test: () => Date.now(),
    constraint: bigger
  },
  'test 4': regexpBetterer('./src/**/*.ts', /(\/\/\s*HACK)/i).only()
};
