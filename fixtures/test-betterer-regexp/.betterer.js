const { regexpBetterer } = require('@betterer/regexp/src');

module.exports = {
  'regexp no hack comments': regexpBetterer('./src/**/*.ts', /(\/\/\s*HACK)/i),
};
