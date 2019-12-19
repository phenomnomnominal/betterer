import { betterer } from '@betterer/betterer/src';
import { fixture } from './index';

describe('betterer', () => {
  it(`should work when a test is the same`, async () => {
    const { paths, logs, readFile, reset } = fixture('test-betterer-same');

    const configPaths = [paths.config];
    const resultsPath = paths.result;

    await reset();

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(firstRun.new).toEqual(['stays the same']);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(secondRun.same).toEqual(['stays the same']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await reset();
  });
});
