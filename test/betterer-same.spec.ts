import { betterer } from '@betterer/betterer';
import { fixture } from './fixture';

describe('betterer', () => {
  it(`should work when a test is the same`, async () => {
    const { paths, logs, readFile, reset } = fixture('test-betterer-same');

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(firstRun.new).toEqual([`doesn't get bigger`, `doesn't get smaller`]);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(secondRun.same).toEqual([`doesn't get bigger`, `doesn't get smaller`]);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await reset();
  });
});
