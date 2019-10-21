module.exports = {
  setupFiles: ['./test/index.ts'],
  globals: {
    tsConfig: 'tsconfig.json'
  },
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: false, //true,
  collectCoverageFrom: ['<rootDir>/packages/**/src/**'],
  coverageDirectory: '<rootDir>/reports/coverage',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '\\.(ts)$': 'ts-jest'
  }
};
