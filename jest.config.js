module.exports = {
  setupFilesAfterEnv: ['./test/setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/packages/**/dist/**/*.js',
    '!<rootDir>/packages/**/dist/**/types.js',
    '!<rootDir>/packages/**/dist/**/public.js',
    '!<rootDir>/packages/extension/.vscode-test/**/*',
    '!<rootDir>/packages/extension/dist/**/*.js',
    '!<rootDir>/packages/fixture/dist/**/*.js'
  ],
  coverageDirectory: '<rootDir>/reports/coverage',
  coverageReporters: ['clover', 'json', 'json-summary', 'lcov', 'text'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '!**/*.e2e.spec.ts', '!**/workers.spec.ts'],
  watchPathIgnorePatterns: ['<rootDir>/fixtures', '<rootDir>/packages/[^/]+/src'],
  modulePathIgnorePatterns: ['<rootDir>/packages/extension']
};
