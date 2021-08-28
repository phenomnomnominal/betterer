import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should work with a .betterer.ts file that uses ES modules', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('config-ts-esm', {
      '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
import { persist } from '@betterer/fixture';

const grows = persist(__dirname, 'grows', 0);

export default {
  test: () => new BettererTest({
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

    const firstRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(firstRun.new)).toEqual(['test']);

    const secondRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(secondRun.better)).toEqual(['test']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
