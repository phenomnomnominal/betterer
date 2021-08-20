import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should mark a file test as expired when it is past its deadline', async () => {
    const { logs, paths, readFile, cleanup, runNames } = await createFixture('deadline-file-test-expired', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  test: () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts').deadline('0')
};
    `
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date().getTime();
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(firstRun.expired)).toEqual(['test']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
