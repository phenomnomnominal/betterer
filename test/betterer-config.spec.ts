import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should throw when there is not a config file', async () => {
    const { logs, paths, cleanup } = await createFixture('test-betterer-config', {});

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should throw when there is invalid config', async () => {
    const { cleanup, logs, paths } = await createFixture('test-betterer-invalid-config', {});
    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const tests = [
      { allowDiff: 1234 },
      { allowDiff: 'betterer' },
      { allowDiff: {} },
      { configPaths: 1234 },
      { configPaths: true },
      { configPaths: {} },
      { configPaths: [1234] },
      { cwd: 1234 },
      { cwd: {} },
      { filters: 1234 },
      { filters: true },
      { filters: {} },
      { filters: [1234] },
      { ignores: 1234 },
      { ignores: true },
      { ignores: {} },
      { ignores: [1234] },
      { resultsPath: 1234 },
      { resultsPath: true },
      { resultsPath: {} },
      { silent: 1234 },
      { silent: 'betterer' },
      { silent: {} },
      { update: 1234 },
      { update: 'betterer' },
      { update: {} }
    ];

    await tests.reduce(async (p, config) => {
      await p;
      // @ts-expect-error testing config errors:
      await expect(async () => await betterer({ configPaths, resultsPath, ...config })).rejects.toThrow();
    }, Promise.resolve());

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
