import { typescriptBetterer } from '@betterer/typescript/src';

export default {
  'typescript use strict mode': typescriptBetterer('./tsconfig.json', {
    strict: true,
  }),
};
