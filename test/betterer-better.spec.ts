import { betterer } from '@betterer/betterer/src';

import { fixture } from './fixture';

describe('betterer', () => {
  it('should work when a test gets better', async () => {
    const { logs, paths, readFile, reset } = fixture('test-betterer-better');

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(firstRun.new).toEqual(['gets better']);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(secondRun.better).toEqual(['gets better']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await reset();
  });
});
