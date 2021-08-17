import { betterer, BettererSuiteSummary } from '@betterer/betterer';
import assert from 'assert';

import { createFixture } from '../fixture';

describe('betterer.watch', () => {
  it('should run in watch mode', async () => {
    const { logs, paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-watch', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': () => tsquery(
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

    await betterer({ configPaths, resultsPath, cwd, workers: 1 });

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
      workers: 1
    });

    await writeFile(indexPath, `console.log('foo');\nconsole.log('foo');console.log('foo');`);

    const worseSuiteSummary = await worse.promise;
    const [worseRun] = worseSuiteSummary.runs;

    expect(worseRun.isWorse).toBe(true);

    await writeFile(indexPath, `console.log('foo');console.log('foo');`);

    const sameSuiteSummary = await same.promise;
    const [sameRun] = sameSuiteSummary.runs;

    expect(sameRun.isSame).toBe(true);

    await writeFile(indexPath, `console.log('bar');`);

    const betterSuiteSummary = await better.promise;
    const [betterRun] = betterSuiteSummary.runs;

    expect(betterRun.isBetter).toBe(true);

    await runner.stop();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should debounce runs when multiple files change', async () => {
    const { logs, paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-watch-debounce', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': () => tsquery(
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
      workers: 1
    });

    await writeFile(indexPath, `console.log('foo');`);
    await writeFile(filePath, `console.log('foo');\nconsole.log('foo');`);
    const suiteSummary = await suiteSummaryDefer.promise;

    await runner.stop();

    expect(suiteSummary.runs).toHaveLength(1);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should ignore .gitignored files', async () => {
    const { logs, paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-watch-gitignored', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': () => tsquery(
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
      workers: 1
    });

    await writeFile(indexPath, `console.log('foo');`);
    await writeFile(ignoredPath, `console.log('foo');`);
    await writeFile(nestedPath, `console.log('foo');`);

    const suiteSummary = await suiteSummaryDefer.promise;
    const [run] = suiteSummary.runs;

    await runner.stop();

    expect(run.filePaths).toHaveLength(1);

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
