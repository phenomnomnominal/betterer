module.exports = {
  setupFiles: ['./test/index.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  globals: {
    tsConfig: 'tsconfig.json'
  },
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/packages/**/src/**'],
  coverageDirectory: '<rootDir>/reports/coverage',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '\\.(ts)$': 'ts-jest'
  }
};
