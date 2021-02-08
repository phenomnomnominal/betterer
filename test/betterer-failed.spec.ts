import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it(`should work when a test fails`, async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('test-betterer-failed', {
      '.betterer.js': `
const { bigger } = require('@betterer/constraints');

module.exports = {
  'throws error': {
    test: () => {
      throw new Error('OH NO!');
    },
    constraint: bigger
  }
};
`
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(runNames(firstRun.failed)).toEqual(['throws error']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });

  it('should throws when reading the results file fails', async () => {
    const { logs, paths, cleanup, resolve, writeFile } = await createFixture('test-betterer-failed-reading', {
      '.betterer.js': `
const { smaller } = require('@betterer/constraints');

let grows = 0;

module.exports = {
  'should shrink': {
    test: () => grows++,
    constraint: smaller
  }
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(resultsPath, 'throw new Error()');

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();
    await expect(async () => {
      const runner = await betterer.runner({ configPaths, resultsPath });
      await runner.queue([indexPath]);
      await runner.stop();
    }).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
