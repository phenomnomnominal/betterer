import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should throw when reading the results file fails', async () => {
    const { logs, paths, cleanup, resolve, writeFile } = await createFixture('results-read-error', {
      '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { smaller } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const grows = persist(__dirname, 'grows', 0);

module.exports = {
  test: () => new BettererTest({
    test: () => grows.increment(),
    constraint: smaller
  })
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(resultsPath, 'throw new Error()');

    await expect(async () => await betterer({ configPaths, resultsPath, workers: 1 })).rejects.toThrow();
    await expect(async () => {
      const runner = await betterer.runner({ configPaths, resultsPath, workers: 1 });
      await runner.queue([indexPath]);
      await runner.stop();
    }).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
