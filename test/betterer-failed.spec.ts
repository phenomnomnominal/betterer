import { betterer } from '@betterer/betterer';
import { promises as fs } from 'fs';

import { fixture } from './fixture';

describe('betterer', () => {
  it(`should work when a test fails`, async () => {
    const { logs, paths, readFile, reset } = fixture('test-betterer-failed');

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(firstRun.failed).toEqual(['throws error']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await reset();
  });

  it('should print the results out when writing the file fails', async () => {
    const { logs, paths, reset } = fixture('test-betterer-failed-writing');

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    jest.spyOn(fs, 'writeFile').mockRejectedValueOnce(new Error());

    await betterer({ configPaths, resultsPath });

    expect(logs).toMatchSnapshot();

    await reset();
  });

  it('should throws when reading the results file fails', async () => {
    const { logs, paths, reset, resolve, writeFile } = fixture('test-betterer-failed-reading');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(resultsPath, 'throw new Error()');

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();
    await expect(async () => await betterer.single({ configPaths, resultsPath }, indexPath)).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
