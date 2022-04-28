import { createFixture } from './fixture';

import { betterer } from '@betterer/betterer';

describe('betterer', () => {
  it('should throw if there is no config', async () => {
    const { paths, logs, cleanup } = await createFixture('stylelint-no-config', {
      '.betterer.js': `
const { stylelint } = require('@betterer/stylelint');

module.exports = {
  'stylelint': () => stylelint().include('./src/**/*.css')
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
