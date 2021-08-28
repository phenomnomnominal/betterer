import { regexp } from '@betterer/regexp';
export default {
  'no hack comments': () =>
    regexp(/(\/\/\s*HACK)/i).include(['./packages/**/src/**/*.ts', './packages/**/src/**/*.tsx'])
};
