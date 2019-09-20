const { eslintBetterer } = require('../../src');

module.exports = {
  'eslint enable new rule': eslintBetterer('./src/**/*.ts', [
    'no-debugger',
    'error'
  ])
};
