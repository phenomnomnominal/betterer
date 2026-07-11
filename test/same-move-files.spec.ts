import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should stay the same when multiple files are moved at once', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { deleteFile, paths, logs, cleanup, resolve, readFile, writeFile, testNames } = await createFixture(
      'same-move-files',
      {
        'src/a.ts': `
const a = 'a';
const one = 1;
console.log(a * one);
      `,
        'src/b.ts': `
const b = 'b';
const two = 2;
console.log(b * two);
      `,
        '.betterer.ts': `
import { typescript } from '@betterer/typescript';

export default {
  test: () => typescript('./tsconfig.json', {
    strict: true
  }).include('./src/**/*.ts')
};
      `,
        'tsconfig.json': `
{
  "compilerOptions": {
    "noEmit": true,
    "lib": ["esnext", "dom"],
    "moduleResolution": "node",
    "target": "ES5",
    "typeRoots": [],
    "resolveJsonModule": true
  },
  "include": ["./src/**/*"]
}
      `
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const aPath = resolve('./src/a.ts');
    const bPath = resolve('./src/b.ts');
    const aMovedPath = resolve('./src/a-moved.ts');
    const bMovedPath = resolve('./src/b-moved.ts');

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(newTestRun.new)).toEqual(['test']);

    const newTestRunResult = await readFile(resultsPath);

    expect(newTestRunResult).toMatchSnapshot();

    await writeFile(aMovedPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);
    await deleteFile(aPath);
    await writeFile(bMovedPath, `const b = 'b';\nconst two = 2;\nconsole.log(b * two);`);
    await deleteFile(bPath);

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(testNames(sameTestRun.same)).toEqual(['test']);

    const sameTestRunResult = await readFile(resultsPath);

    expect(sameTestRunResult).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
