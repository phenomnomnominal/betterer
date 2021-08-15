import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
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
import { persist } from '@betterer/fixture';

const grows = persist(__dirname, 'grows', 0);

export function test (): number {
  return grows.increment();
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
