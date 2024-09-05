import assert from 'node:assert';

import { describe, expect, it } from 'vitest';

import { createFixture } from '../fixture.js';

describe('betterer.watch', () => {
  it('should quit when "q" is pressed', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { getStdInΔ } = await import('@betterer/render');

    const { logs, paths, cleanup, resolve, writeFile } = await createFixture('watch-quit', {
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

    const suiteEndDefer = defer();
    const contextEndDefer = defer();

    await betterer.watch({
      configPaths,
      resultsPath,
      cwd,
      reporters: [
        '@betterer/reporter',
        {
          suiteEnd() {
            suiteEndDefer.resolve();
          },
          contextEnd() {
            contextEndDefer.resolve();
          }
        }
      ],
      workers: false
    });

    await writeFile(indexPath, `console.log('foo');console.log('foo');`);

    await suiteEndDefer.promise;

    // Press "q" to quit watch mode:
    getStdInΔ().emit('data', 'q');

    await contextEndDefer.promise;

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});

type Resolve<T> = (value: T) => void;
type Reject = (error: Error) => void;
interface Defer<T = void> {
  promise: Promise<T>;
  resolve: Resolve<T>;
  reject: Reject;
}

function defer<T = void>(): Defer<T> {
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
