import { typescriptBetterer } from '@betterer/typescript';

export default {
  'typescript use strict mode': typescriptBetterer('./tsconfig.json', {
    strict: true
  })
};
