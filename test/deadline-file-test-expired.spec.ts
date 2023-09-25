// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from './fixture';

// vitest.resetModules();
// vitest.mock('@betterer/time', async (importOriginal): Promise<typeof import('@betterer/time')> => {
//   const time: typeof import('@betterer/time') = await importOriginal();
//
//   return {
//     ...time,
//     getPreciseTime__: () => 0,
//     getTime__: () => Date.now()
//   };
// });

describe('betterer', () => {
  it('should mark a file test as expired when it is past its deadline', async () => {
    process.env.BETTERER_TEST_TIME = Date.now().toString();

    const { betterer } = await import('@betterer/betterer');

    const { logs, paths, readFile, cleanup, testNames } = await createFixture('deadline-file-test-expired', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  test: () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts').deadline('0')
};
    `,
      'src/index.ts': `
console.log('foo')
    `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(firstRun.expired)).toEqual(['test']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();

    process.env.BETTERER_TEST_TIME = '';
  });
});
