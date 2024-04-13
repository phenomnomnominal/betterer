// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

describe('betterer --reporter', () => {
  it('should throw when a hook is not a function', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { logs, paths, cleanup, resolve } = await createFixture('reporter-invalid-hook-function', {
      'reporter.js': `
module.exports.reporter = {
    contextStart: ''
};
      `
    });

    const resultsPath = paths.results;
    const reporters = [resolve('reporter.js')];

    await expect(
      async () => await betterer({ configPaths: [], resultsPath, reporters, workers: false })
    ).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
