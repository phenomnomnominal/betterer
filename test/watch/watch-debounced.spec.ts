import { watch, BettererSuiteSummary } from '@betterer/betterer';
import assert from 'assert';

import { createFixture } from '../fixture';

describe('betterer.watch', () => {
  it('should debounce runs when multiple files change', async () => {
    const { logs, paths, resolve, cleanup, writeFile } = await createFixture('watch-debounce', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  test: () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts')
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const filePath = resolve('./src/file.ts');
    const { cwd } = paths;

    const suiteSummaryDefer = defer<BettererSuiteSummary>();

    const runner = await watch({
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
    await writeFile(filePath, `console.log('foo');\nconsole.log('foo');`);
    const suiteSummary = await suiteSummaryDefer.promise;

    await runner.stop();

    expect(suiteSummary.runSummaries).toHaveLength(1);

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
