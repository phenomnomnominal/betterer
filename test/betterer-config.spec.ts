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

  it('should work with a .betterer.ts file', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('test-betterer-config-ts', {
      '.betterer.ts': `
const { BettererTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const grows = persist(__dirname, 'grows', 0);

module.exports = {
  'gets better': () => new BettererTest({
    test: () => grows.increment(),
    constraint: bigger
  })
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(firstRun.new)).toEqual(['gets better']);

    const secondRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(secondRun.better)).toEqual(['gets better']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });

  it('should load a custom tsconfigPath', async () => {
    const { logs, paths, resolve, cleanup } = await createFixture('test-betterer-config-ts-tsconfig', {
      '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
import { test } from './test';

export default {
  'gets better': () => new BettererTest({
    test,
    constraint: bigger
  })
};
      `,
      'test.ts': `
let start = 0;
export function test (): number {
  return start++;
}
      `,
      'typescript.json': `
{
  "compilerOptions": {
    "target": "foo",
  }
}
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    // Test throws on purpose with the invalid "target" type:
    await expect(
      async () => await betterer({ configPaths, resultsPath, tsconfigPath: resolve('./typescript.json') })
    ).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should work with a .betterer.ts file that uses ES modules', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('test-betterer-config-ts-esm', {
      '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
import { persist } from '@betterer/fixture';

const grows = persist(__dirname, 'grows', 0);

export default {
  'gets better': () => new BettererTest({
    test: () => grows.increment(),
    constraint: bigger
  })
};
      `,
      'tsconfig.json': `
{
  "compilerOptions": {
    "module": "ESNext",
  },
}
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(firstRun.new)).toEqual(['gets better']);

    const secondRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(secondRun.better)).toEqual(['gets better']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
