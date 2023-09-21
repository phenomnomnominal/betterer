import { regexp } from '@betterer/regexp';

export default {
  test: () => regexp(/(\/\/\s*HACK)/i).include('./src/**/*.ts')
};