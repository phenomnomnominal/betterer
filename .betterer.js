const { regexpBetterer } = require('@betterer/regexp');
const { tsqueryBetterer } = require('@betterer/tsquery');

module.exports = {
  'no hack comments': regexpBetterer(
    './packages/**/src/**/*.ts',
    /(\/\/\s*HACK)/i
  ),
  'no raw console.log': tsqueryBetterer(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
};
