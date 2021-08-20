import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should throw if there is no query', async () => {
    const { paths, logs, cleanup } = await createFixture('tsquery-no-query', {
      '.betterer.js': `
const { tsquery } = require('@betterer/tsquery');

module.exports = {
  tsquery: () => tsquery()
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
