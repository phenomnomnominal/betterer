import { eslint } from '@betterer/eslint';
import { regexp } from '@betterer/regexp';

export default {
  'no hack comments': regexp(/(\/\/\s*HACK)/i).include('./packages/**/src/**/*.ts'),

  'new eslint rules': eslint({
    '@typescript-eslint/no-floating-promises': 2
  }).include('./packages/**/src/**/*.{js,ts}', './test/**/*.{js,ts}', './*.{js,ts}')
};
