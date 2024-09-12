import type { BettererSuiteSummary } from '@betterer/betterer';

import { describe, expect, it } from 'vitest';

import assert from 'node:assert';

import { createFixture } from '../fixture.js';

describe('betterer.watch', () => {
  it('should filter in watch mode', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { getStdInΔ } = await import('@betterer/render');

    const { logs, paths, resolve, cleanup, writeFile } = await createFixture('watch-filter', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  test1: () => tsquery(
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts'),
  test2: () => tsquery('DebuggerStatement').include('./src/**/*.ts')
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const { cwd } = paths;

    await writeFile(indexPath, `console.log('foo');`);

    await betterer({ configPaths, resultsPath, cwd, workers: false });

    const suiteSummaryDefers = [defer<BettererSuiteSummary>(), defer<BettererSuiteSummary>()];
    const [worse, filtered] = suiteSummaryDefers;

    const runner = await betterer.watch({
      configPaths,
      resultsPath,
      cwd,
      reporters: [
        '@betterer/reporter',
        {
          suiteEnd(suiteSummary: BettererSuiteSummary) {
            debugger;
            const suiteSummaryDefer = suiteSummaryDefers.shift();
            suiteSummaryDefer?.resolve(suiteSummary);
          },
          suiteError(_, error) {
            debugger;
            const suiteSummaryDefer = suiteSummaryDefers.shift();
            suiteSummaryDefer?.reject(error);
          }
        }
      ],
      strict: false,
      workers: false
    });

    await writeFile(indexPath, `console.log('foo');debugger;`);

    const worseSuiteSummary = await worse.promise;

    expect(worseSuiteSummary.runSummaries).toHaveLength(2);

    // Press "f" to enter filter mode:
    getStdInΔ().emit('data', 'f');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Press "2" to target "test2":
    getStdInΔ().emit('data', '2');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Press "Enter" to enable the filter:
    getStdInΔ().emit('data', '\r');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    debugger;

    await writeFile(indexPath, `console.log('foo');debugger;debugger;`);

    const filteredSuiteSummary = await filtered.promise;
    expect(filteredSuiteSummary.runSummaries).toHaveLength(2);

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
