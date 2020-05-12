import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should work when a test gets better', async () => {
    const { logs, paths, readFile, cleanup } = await createFixture('test-betterer-better', {
      '.betterer.js': `
const { smaller, bigger } = require('@betterer/constraints');

let grows = 0;
let shrinks = 2;

module.exports = {
  'should shrink': {
    test: () => shrinks--,
    constraint: smaller
  },
  'should grow': {
    test: () => grows++,
    constraint: bigger
  }
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(firstRun.new).toEqual(['should shrink', 'should grow']);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(secondRun.better).toEqual(['should shrink', 'should grow']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
