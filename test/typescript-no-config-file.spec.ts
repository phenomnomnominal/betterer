import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should throw if there is no configFilePath', async () => {
    const { paths, logs, cleanup } = await createFixture('typescript-no-config-file', {
      '.betterer.js': `
const { typescript } = require('@betterer/typescript');

module.exports = {
  typescript: () => typescript()
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
