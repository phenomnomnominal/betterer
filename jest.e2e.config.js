module.exports = {
  setupFilesAfterEnv: ['./test/setup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.*\\.e2e.spec\\.ts$',
  watchPathIgnorePatterns: ['<rootDir>/fixtures', '<rootDir>/packages/[^/]+/src'],
  modulePathIgnorePatterns: ['<rootDir>/packages/extension']
};
