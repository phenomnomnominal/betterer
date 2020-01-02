import { betterer } from '@betterer/betterer/src';

import { fixture } from './fixture';

describe('betterer', () => {
  it('should run specific tests', async () => {
    const { logs, paths, readFile, reset, resolve, writeFile } = fixture(
      'test-betterer-only'
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(indexPath, `// HACK:`);

    const run = await betterer({ configPaths, resultsPath });

    expect(run.ran).toEqual(['test 1', 'test 2', 'test 3', 'test 4']);
    expect(run.skipped).toEqual([]);

    const onlyRun = await betterer({
      configPaths: [resolve('./.betterer.only.ts')],
      resultsPath
    });

    expect(onlyRun.ran).toEqual(['test 1', 'test 4']);
    expect(onlyRun.skipped).toEqual(['test 2', 'test 3']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await reset();
  });
});
