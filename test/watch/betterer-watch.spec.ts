import { betterer, BettererSummary } from '@betterer/betterer';
import assert from 'assert';

import { createFixture } from '../fixture';

describe('betterer.watch', () => {
  it('should run in watch mode', async () => {
    const { logs, paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-watch', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': tsquery(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
};
      `,
      'tsconfig.json': `
{
  "compilerOptions": {
    "noEmit": true,
    "lib": ["esnext"],
    "moduleResolution": "node",
    "target": "ES5",
    "typeRoots": ["../../node_modules/@types/"],
    "resolveJsonModule": true
  },
  "include": ["./src/**/*", ".betterer.ts"]
}
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const { cwd } = paths;

    await writeFile(indexPath, `console.log('foo');console.log('foo');`);

    await betterer({ configPaths, resultsPath, cwd });

    const summaryDefers = [defer<BettererSummary>(), defer<BettererSummary>(), defer<BettererSummary>()];
    const [worse, same, better] = summaryDefers;

    const runner = await betterer.watch({
      configPaths,
      resultsPath,
      cwd,
      reporters: [
        '@betterer/watch-reporter',
        {
          runsEnd(summary) {
            const summaryDefer = summaryDefers.shift();
            summaryDefer?.resolve(summary);
          }
        }
      ]
    });

    await writeFile(indexPath, `console.log('foo');\nconsole.log('foo');console.log('foo');`);

    const worseSummary = await worse.promise;
    const [worseRun] = worseSummary.runs;

    expect(worseRun.isWorse).toBe(true);

    await writeFile(indexPath, `console.log('foo');console.log('foo');`);

    const sameSummary = await same.promise;
    const [sameRun] = sameSummary.runs;

    expect(sameRun.isSame).toBe(true);

    await writeFile(indexPath, `console.log('bar');`);

    const betterSummary = await better.promise;
    const [betterRun] = betterSummary.runs;

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
  'tsquery no raw console.log': tsquery(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
};
      `,
      'tsconfig.json': `
{
  "compilerOptions": {
    "noEmit": true,
    "lib": ["esnext"],
    "moduleResolution": "node",
    "target": "ES5",
    "typeRoots": ["../../node_modules/@types/"],
    "resolveJsonModule": true
  },
  "include": ["./src/**/*", ".betterer.ts"]
}
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const filePath = resolve('./src/file.ts');
    const { cwd } = paths;

    const runDefer = defer<BettererSummary>();

    const runner = await betterer.watch({
      configPaths,
      resultsPath,
      cwd,
      reporters: [
        '@betterer/watch-reporter',
        {
          runsEnd(summary) {
            runDefer.resolve(summary);
          }
        }
      ]
    });

    await writeFile(indexPath, `console.log('foo');`);
    await writeFile(filePath, `console.log('foo');\nconsole.log('foo');`);
    const summary = await runDefer.promise;

    await runner.stop();

    expect(summary.runs).toHaveLength(1);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should ignore .gitignored files', async () => {
    const { logs, paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-watch-gitignored', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': tsquery(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
};
      `,
      'tsconfig.json': `
{
  "compilerOptions": {
    "noEmit": true,
    "lib": ["esnext"],
    "moduleResolution": "node",
    "target": "ES5",
    "typeRoots": ["../../node_modules/@types/"],
    "resolveJsonModule": true
  },
  "include": ["./src/**/*", ".betterer.ts"]
}
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

    const runDefer = defer<BettererSummary>();

    const runner = await betterer.watch({
      configPaths,
      resultsPath,
      cwd,
      reporters: [
        '@betterer/watch-reporter',
        {
          runsEnd(summary) {
            runDefer.resolve(summary);
          }
        }
      ]
    });

    await writeFile(indexPath, `console.log('foo');`);
    await writeFile(ignoredPath, `console.log('foo');`);
    await writeFile(nestedPath, `console.log('foo');`);

    const summary = await runDefer.promise;
    const [run] = summary.runs;

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
