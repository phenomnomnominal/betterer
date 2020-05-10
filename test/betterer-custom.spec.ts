import { betterer } from '@betterer/betterer';

import { fixture } from './fixture';

describe('betterer', () => {
  it('should throw if there is no constraint', async () => {
    const { paths, logs, reset } = fixture('test-betterer-custom-no-constraint');

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await reset();
  });

  it('should throw if there is no test', async () => {
    const { paths, logs, reset } = fixture('test-betterer-custom-no-test');

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
