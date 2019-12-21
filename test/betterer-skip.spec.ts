import { betterer } from '@betterer/betterer/src';

import { fixture } from './fixture';

describe('betterer', () => {
  it('should skip a test', async () => {
    const { logs, paths, readFile, reset, resolve } = fixture(
      'test-betterer-skip'
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    const run = await betterer({ configPaths, resultsPath });

    expect(run.ran).toEqual(['test 1', 'test 2']);
    expect(run.skipped).toEqual([]);

    const skipRun = await betterer({
      configPaths: [resolve('./betterer.skip.ts')],
      resultsPath
    });

    expect(skipRun.ran).toEqual([]);
    expect(skipRun.skipped).toEqual(['test 1', 'test 2']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await reset();
  });
});
