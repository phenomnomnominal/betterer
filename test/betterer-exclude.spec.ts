import { betterer } from '@betterer/betterer';

import { fixture } from './fixture';

describe('betterer', () => {
  it('should exclude specific files from results', async () => {
    const { logs, paths, readFile, reset, resolve, writeFile } = fixture('test-betterer-exclude');

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    await writeFile(resolve('./src/index.ts'), '// Hack');
    await writeFile(resolve('./src/exclude.ts'), '// Hack');

    await betterer({ configPaths, resultsPath });

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await betterer({
      configPaths: [resolve('./.betterer.exclude.ts')],
      resultsPath
    });

    const excludeResult = await readFile(resultsPath);

    expect(excludeResult).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
