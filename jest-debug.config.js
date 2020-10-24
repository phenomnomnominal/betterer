const config = require('./jest.config');

module.exports = {
  ...config,
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test-debug.json'
    }
  },
  collectCoverage: false
};
