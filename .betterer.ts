import { eslint } from '@betterer/eslint';
import { regexp } from '@betterer/regexp';

export default {
  'no hack comments': regexp(/(\/\/\s*HACK)/i)
    .include('./packages/**/src/**/*.ts')
    .include('./packages/**/src/**/*.tsx')
};
