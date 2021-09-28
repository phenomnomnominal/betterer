import { betterer, BettererSuiteSummary } from '@betterer/betterer';
import assert from 'assert';

import { createFixture } from '../fixture';

describe('betterer.watch', () => {
  it('should ignore .gitignored files', async () => {
    const { logs, paths, resolve, cleanup, writeFile } = await createFixture('watch-ignored', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  test: () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts')
};
      `,
      './src/.gitignore': `
ignored.ts
      `,
      './src/nested/.gitignore': `
ignored.ts
        `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const ignoredPath = resolve('./src/ignored.ts');
    const nestedPath = resolve('./src/nested/ignored.ts');
    const { cwd } = paths;

    const suiteSummaryDefer = defer<BettererSuiteSummary>();

    const runner = await betterer.watch({
      configPaths,
      resultsPath,
      cwd,
      reporters: [
        '@betterer/reporter',
        {
          suiteEnd(suiteSummary: BettererSuiteSummary) {
            suiteSummaryDefer.resolve(suiteSummary);
          }
        }
      ],
      workers: false
    });

    await writeFile(indexPath, `console.log('foo');`);
    await writeFile(ignoredPath, `console.log('foo');`);
    await writeFile(nestedPath, `console.log('foo');`);

    const suiteSummary = await suiteSummaryDefer.promise;
    const [runSummary] = suiteSummary.runSummaries;

    await runner.stop();

    expect(runSummary.filePaths).toHaveLength(1);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});

type Resolve<T> = (value: T) => void;
type Reject = (error: Error) => void;
type Defer<T> = {
  promise: Promise<T>;
  resolve: Resolve<T>;
  reject: Reject;
};

function defer<T>(): Defer<T> {
  let resolve: Resolve<T> | null = null;
  let reject: Reject | null = null;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  assert(resolve);
  assert(reject);
  return { promise, resolve, reject };
}
