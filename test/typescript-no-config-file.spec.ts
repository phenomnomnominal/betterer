// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

describe('betterer', () => {
  it('should throw if there is no configFilePath', async () => {
    const { betterer } = await import('@betterer/betterer');

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

    await expect(async () => await betterer({ configPaths, resultsPath, workers: false })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
