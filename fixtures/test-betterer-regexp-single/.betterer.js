const { regexpBetterer } = require('@betterer/regexp');

module.exports = {
  'regexp no hack comments': regexpBetterer('./src/**/*.ts', /(\/\/\s*HACK)/i)
};
