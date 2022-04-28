import { createFixture } from './fixture';

import { betterer } from '@betterer/betterer';

describe('betterer', () => {
  it('should throw if there are no config', async () => {
    const { paths, logs, cleanup } = await createFixture('eslint-no-config', {
      '.betterer.js': `
const { eslint } = require('@betterer/eslint');

module.exports = {
  test: () => eslint().include('./src/**/*.ts')
};      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath, workers: false })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
