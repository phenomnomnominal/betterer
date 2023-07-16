import type { BettererSuiteSummary } from '@betterer/betterer';

import assert from 'node:assert';

// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from '../fixture';

describe('betterer.watch', () => {
  it('should run in watch mode', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { logs, paths, resolve, cleanup, writeFile } = await createFixture('watch', {
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
    const { cwd } = paths;

    await writeFile(indexPath, `console.log('foo');console.log('foo');`);

    await betterer({ configPaths, resultsPath, cwd, workers: false });

    const suiteSummaryDefers = [
      defer<BettererSuiteSummary>(),
      defer<BettererSuiteSummary>(),
      defer<BettererSuiteSummary>()
    ];
    const [worse, same, better] = suiteSummaryDefers;

    const runner = await betterer.watch({
      configPaths,
      resultsPath,
      cwd,
      reporters: [
        '@betterer/reporter',
        {
          suiteEnd(suiteSummary: BettererSuiteSummary) {
            const suiteSummaryDefer = suiteSummaryDefers.shift();
            suiteSummaryDefer?.resolve(suiteSummary);
          }
        }
      ],
      workers: false
    });

    await writeFile(indexPath, `console.log('foo');\nconsole.log('foo');console.log('foo');`);

    const worseSuiteSummary = await worse.promise;
    const [worseRunSummary] = worseSuiteSummary.runSummaries;

    expect(worseRunSummary.isWorse).toBe(true);

    await writeFile(indexPath, `console.log('foo');console.log('foo');`);

    const sameSuiteSummary = await same.promise;
    const [sameRunSummary] = sameSuiteSummary.runSummaries;

    expect(sameRunSummary.isSame).toBe(true);

    await writeFile(indexPath, `console.log('bar');`);

    const betterSuiteSummary = await better.promise;
    const [betterRunSummary] = betterSuiteSummary.runSummaries;

    expect(betterRunSummary.isBetter).toBe(true);

    await runner.stop();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});

type Resolve<T> = (value: T) => void;
type Reject = (error: Error) => void;
interface Defer<T> {
  promise: Promise<T>;
  resolve: Resolve<T>;
  reject: Reject;
}

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
