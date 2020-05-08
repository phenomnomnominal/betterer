const { eslintBetterer } = require('@betterer/eslint');

module.exports = {
  'eslint enable new rule': eslintBetterer('./src/**/*.ts', ['no-debugger', 'error'])
};
