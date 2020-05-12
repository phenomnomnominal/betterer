import { betterer } from '@betterer/betterer';

import { fixture } from './fixture';

'../fixtures/test-betterer-complete';

describe('betterer', () => {
  it(`should work when a test meets its goal`, async () => {
    const { logs, paths, readFile, reset } = fixture('test-betterer-complete');

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(firstRun.new).toEqual(['gets completed', 'already completed']);
    expect(firstRun.completed).toEqual(['already completed']);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(secondRun.better).toEqual(['gets completed']);

    const thirdRun = await betterer({ configPaths, resultsPath });

    expect(thirdRun.completed).toEqual(['gets completed', 'already completed']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await reset();
  });
});
