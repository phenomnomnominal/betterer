import { eslintBetterer } from '@betterer/eslint';

export default {
  'eslint enable no-debugger rule': eslintBetterer('./src/**/*.ts', ['no-debugger', 'error'])
};
