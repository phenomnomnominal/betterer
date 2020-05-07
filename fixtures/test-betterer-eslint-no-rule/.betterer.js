const { eslintBetterer } = require('@betterer/eslint');

module.exports = {
  'eslint enable complex rule': eslintBetterer('./src/**/*.ts')
};
