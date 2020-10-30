const config = require('./jest.config');

module.exports = {
  ...config,
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test-debug.json'
    }
  },
  collectCoverage: false
};
