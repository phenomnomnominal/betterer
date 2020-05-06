import { regexpBetterer } from '@betterer/regexp/src';

export default {
  'regexp no hack comments': regexpBetterer('./src/**/*.ts', /(\/\/\s*HACK)/i)
};
