import { betterer } from '@betterer/betterer';
import assert from 'assert';

import { createFixture } from '../fixture';

describe('betterer.watch', () => {
  it('should quit when "q" is pressed', async () => {
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

    const suiteEndDefer = defer<void>();
    const contextEndDefer = defer<void>();

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
    process.stdin.emit('data', 'q');

    await contextEndDefer.promise;

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
