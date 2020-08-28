import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should work with a .betterer.ts file', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('test-betterer-config-ts', {
      '.betterer.ts': `
const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports = {
  'gets better': {
    test: () => start++,
    constraint: bigger
  }
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(runNames(firstRun.new)).toEqual(['gets better']);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(runNames(secondRun.better)).toEqual(['gets better']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
