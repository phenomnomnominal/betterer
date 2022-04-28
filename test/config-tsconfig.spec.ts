import { createFixture } from './fixture';

import { betterer } from '@betterer/betterer';

describe('betterer', () => {
  it('should load a custom tsconfigPath', async () => {
    const { logs, paths, resolve, cleanup } = await createFixture('config-tsconfig', {
      '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
import { test } from './test';

export default {
  test: () => new BettererTest({
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
});
