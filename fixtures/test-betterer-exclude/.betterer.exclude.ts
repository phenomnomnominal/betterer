import { regexpBetterer } from '@betterer/regexp';

export default {
  'regexp no hack comments': regexpBetterer('./src/**/*.ts', /(\/\/\s*HACK)/i).exclude(/exclude.ts/)
};
