import { betterer } from '@betterer/betterer';
import { createFixtureΔ } from '@betterer/fixture';

describe('betterer', () => {
  it('should work with named exports in the config file', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixtureΔ('test-betterer-named-exports', {
      '.betterer.ts': `
import { bigger } from '@betterer/constraints';

let start = 0;

export const getsBetter = {
  test: () => start++,
  constraint: bigger
};      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(runNames(firstRun.new)).toEqual(['getsBetter']);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(runNames(secondRun.better)).toEqual(['getsBetter']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
