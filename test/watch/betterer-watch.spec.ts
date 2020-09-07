import { betterer } from '@betterer/betterer';

import { createFixture } from '../fixture';

describe('betterer.watch', () => {
  it('should run in watch mode', async () => {
    const { logs, paths, resolve, cleanup, writeFile, waitForRun } = await createFixture('test-betterer-watch', {
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

    const watcher = await betterer.watch({ configPaths, resultsPath, cwd });

    await writeFile(indexPath, `console.log('foo');\nconsole.log('foo');console.log('foo');`);

    const worseSummary = await waitForRun(watcher);
    const [worseRun] = worseSummary.runs;

    expect(worseRun.isWorse).toBe(true);

    await writeFile(indexPath, `console.log('foo');console.log('foo');`);

    const sameSummary = await waitForRun(watcher);
    const [sameRun] = sameSummary.runs;

    expect(sameRun.isSame).toBe(true);

    await writeFile(indexPath, `console.log('bar');`);

    const betterSummary = await waitForRun(watcher);
    const [betterRun] = betterSummary.runs;

    expect(betterRun.isBetter).toBe(true);

    await watcher.stop();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should debounce runs when multiple files change', async () => {
    const { logs, paths, resolve, cleanup, writeFile, waitForRun } = await createFixture(
      'test-betterer-watch-debounce',
      {
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
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const filePath = resolve('./src/file.ts');
    const { cwd } = paths;

    const watcher = await betterer.watch({ configPaths, resultsPath, cwd });

    await writeFile(indexPath, `console.log('foo');`);
    await writeFile(filePath, `console.log('foo');\nconsole.log('foo');`);
    const summary = await waitForRun(watcher);

    await watcher.stop();

    expect(summary.runs).toHaveLength(1);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should ignore .gitignored files', async () => {
    const { logs, paths, resolve, cleanup, writeFile, waitForRun } = await createFixture(
      'test-betterer-watch-debounce',
      {
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
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const ignoredPath = resolve('./src/ignored.ts');
    const nestedPath = resolve('./src/nested/ignored.ts');
    const { cwd } = paths;

    const watcher = await betterer.watch({ configPaths, resultsPath, cwd });

    await writeFile(indexPath, `console.log('foo');`);
    await writeFile(ignoredPath, `console.log('foo');`);
    await writeFile(nestedPath, `console.log('foo');`);

    const summary = await waitForRun(watcher);
    const [run] = summary.runs;

    await watcher.stop();

    expect(run.filePaths).toHaveLength(1);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
