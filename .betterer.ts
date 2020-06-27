import { eslint } from '@betterer/eslint';
import { regexp } from '@betterer/regexp';

export default {
  'no hack comments': regexp(/(\/\/\s*HACK)/i).include('./packages/**/src/**/*.ts'),

  'new eslint rules': eslint({
    '@typescript-eslint/ban-types': 2,
    '@typescript-eslint/restrict-template-expressions': 2,
    '@typescript-eslint/no-floating-promises': 2,
    '@typescript-eslint/no-unsafe-assignment': 2,
    '@typescript-eslint/no-unsafe-call': 2,
    '@typescript-eslint/no-unsafe-member-access': 2,
    '@typescript-eslint/no-unsafe-return': 2
  }).include('./packages/**/src/**/*.{js,ts}', './test/**/*.{js,ts}', './*.{js,ts}')
};
