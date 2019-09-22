module.exports = {
  preset: 'ts-jest',
  setupFiles: ['./test/index.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/packages/**/src/**'],
  coverageDirectory: '<rootDir>/reports/coverage',
  testRegex: '.*\\.spec\\.ts$'
};
