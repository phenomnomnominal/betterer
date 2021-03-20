const { eslint } = require('@betterer/eslint');

module.exports = {
  'eslint enable new rule': eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
};