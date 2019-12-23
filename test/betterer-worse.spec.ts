import { betterer } from '@betterer/betterer/src';
import { fixture } from './fixture';

describe('betterer', () => {
  it('should work when a test gets worse', async () => {
    const { paths, logs, resolve, readFile, reset } = fixture('test-betterer-worse');

    const configPaths = [paths.config];
    const resultsPath = resolve(paths.results);

    await reset();

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(firstRun.new).toEqual(['gets worse']);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(secondRun.worse).toEqual(['gets worse']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await reset();
  });
});
