const { eslint } = require('../../node_modules/@betterer/eslint');

    module.exports = {
      'e2e-eslint': () => eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
    };