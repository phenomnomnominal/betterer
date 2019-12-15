const { eslintBetterer } = require('@betterer/eslint/src');

module.exports = {
  'eslint enable new rule': eslintBetterer('./src/**/*.ts', [
    'no-debugger',
    'error'
  ])
};
