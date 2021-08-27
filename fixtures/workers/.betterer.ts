import { BettererTest } from '@betterer/betterer';
import { bigger, smaller } from '@betterer/constraints';
import { regexp } from '@betterer/regexp';
import { tsquery } from '@betterer/tsquery';

export default {
  'test 1': () => new BettererTest({
    test: () => 0,
    constraint: bigger
  }),
  'test 2': () => new BettererTest({
    test: () => 0,
    constraint: smaller
  }),
  'test 3': () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts'),
  'test 4': () => regexp(/(\/\/\s*HACK)/i).include('./src/**/*.ts')
};