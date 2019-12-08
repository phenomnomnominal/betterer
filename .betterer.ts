import { regexpBetterer } from '@betterer/regexp';
import { tsqueryBetterer } from '@betterer/tsquery';

export default {
  'no hack comments': regexpBetterer(
    './packages/**/src/**/*.ts',
    /(\/\/\s*HACK)/i
  ),
  'no raw console.log': tsqueryBetterer(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
};
