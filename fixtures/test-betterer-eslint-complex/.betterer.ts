import { eslintBetterer } from '@betterer/eslint/src';

export default {
  'eslint enable no-debugger rule': eslintBetterer('./src/**/*.ts', ['no-debugger', 'error']),
};
