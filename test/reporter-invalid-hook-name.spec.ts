// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

describe('betterer --reporter', () => {
  it('should throw when there is an invalid hook name', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { logs, paths, cleanup, resolve } = await createFixture('reporter-invalid-hook-name', {
      'reporter.js': `
module.exports.reporter = {
    notAHook: ''
};
      `
    });

    const resultsPath = paths.results;
    const reporters = [resolve('reporter.js')];

    await expect(async () => {
      await betterer({ configPaths: [], resultsPath, reporters, workers: false });
    }).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
