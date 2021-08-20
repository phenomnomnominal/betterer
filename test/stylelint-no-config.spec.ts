import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

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

    try {
      await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();
    } catch (error) {
      //
    }

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
