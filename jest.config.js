module.exports = {
  setupFilesAfterEnv: ['./test/setup.ts'],
  globals: {
    tsConfig: 'tsconfig.json'
  },
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/packages/**/src/**'],
  coverageDirectory: '<rootDir>/reports/coverage',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '\\.(ts)$': 'ts-jest'
  }
};
