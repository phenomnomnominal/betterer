const { tsqueryBetterer } = require('@betterer/tsquery');

module.exports = {
  'tsquery no raw console.log': tsqueryBetterer('./tsconfig.json')
};
