import { tsqueryBetterer } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': tsqueryBetterer(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
};
