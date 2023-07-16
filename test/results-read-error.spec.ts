// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

describe('betterer', () => {
  it('should throw when reading the results file fails', async () => {
    const { betterer, runner } = await import('@betterer/betterer');

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

    await expect(async () => await betterer({ configPaths, resultsPath, workers: false })).rejects.toThrow();
    await expect(async () => {
      const throwRunner = await runner({ configPaths, resultsPath, workers: false });
      await throwRunner.queue([indexPath]);
      await throwRunner.stop();
    }).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
