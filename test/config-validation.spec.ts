import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

jest.mock('os', () => {
  const os: typeof import('os') = jest.requireActual('os');
  const [cpu] = os.cpus();
  return {
    ...os,
    cpus: () => [cpu]
  };
});

describe('betterer', () => {
  it('should throw when there is invalid config', async () => {
    const { cleanup, logs, paths } = await createFixture('config-validation', {});
    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const tests = [
      { cache: 1234 },
      { cache: 'betterer' },
      { cache: {} },
      { cachePath: 1234 },
      { cachePath: {} },
      { cachePath: true },
      { ci: 1234 },
      { ci: 'betterer' },
      { ci: {} },
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
      { precommit: 1234 },
      { precommit: 'betterer' },
      { precommit: {} },
      { resultsPath: 1234 },
      { resultsPath: true },
      { resultsPath: {} },
      { silent: 1234 },
      { silent: 'betterer' },
      { silent: {} },
      { strict: 1234 },
      { strict: 'betterer' },
      { strict: {} },
      { update: 1234 },
      { update: 'betterer' },
      { update: {} },
      { workers: 'betterer' },
      { workers: true },
      { workers: {} },
      { workers: -1 },
      { workers: 1000 }
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
