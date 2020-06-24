import { betterer } from '@betterer/betterer';

import { createFixture } from '../fixture';

describe('betterer.watch', () => {
  it('should run in watch mode', async () => {
    const { logs, paths, resolve, cleanup, writeFile, waitForRun } = await createFixture('test-betterer-watch', {
      '.betterer.ts': `
import { tsqueryBetterer } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': tsqueryBetterer(
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

    const [worseRun] = await waitForRun(watcher);

    expect(worseRun.isWorse).toBe(true);

    await writeFile(indexPath, `console.log('foo');console.log('foo');`);

    const [sameRun] = await waitForRun(watcher);

    expect(sameRun.isSame).toBe(true);

    await writeFile(indexPath, `console.log('bar');`);

    const [betterRun] = await waitForRun(watcher);

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
import { tsqueryBetterer } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': tsqueryBetterer(
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
    const runs = await waitForRun(watcher);

    await watcher.stop();

    expect(runs).toHaveLength(1);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should ignore .gitignored files', async () => {
    const { logs, paths, resolve, cleanup, writeFile, waitForRun } = await createFixture(
      'test-betterer-watch-debounce',
      {
        '.betterer.ts': `
import { tsqueryBetterer } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': tsqueryBetterer(
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
    const [run] = await waitForRun(watcher);

    await watcher.stop();

    expect(run.files).toHaveLength(1);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
