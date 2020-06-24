import { eslintBetterer } from '@betterer/eslint';
import { regexpBetterer } from '@betterer/regexp';
import { tsqueryBetterer } from '@betterer/tsquery';

const WIP_LINT_TEST = [
  '@typescript-eslint/ban-types',
  '@typescript-eslint/restrict-template-expressions',
  '@typescript-eslint/no-floating-promises',
  '@typescript-eslint/no-unsafe-assignment',
  '@typescript-eslint/no-unsafe-call',
  '@typescript-eslint/no-unsafe-member-access',
  '@typescript-eslint/no-unsafe-return'
].reduce((rules, ruleName) => {
  rules[ruleName] = eslintBetterer('./packages/**/src/**/*.{js,ts}', [ruleName, 2]).include(
    './test/**/*.{js,ts}',
    './*.{js,ts}'
  );
  return rules;
}, {});

export default {
  'no hack comments': regexpBetterer('./packages/**/src/**/*.ts', /(\/\/\s*HACK)/i),
  'no raw console.log': tsqueryBetterer(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).exclude(/logger\/src/, /betterer\/src\/reporters/),
  ...WIP_LINT_TEST
};
