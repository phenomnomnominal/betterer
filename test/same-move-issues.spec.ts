import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should stay the same when multiple issues are moved', async () => {
    const { paths, logs, cleanup, resolve, readFile, writeFile, runNames } = await createFixture('same-move-issues', {
      'src/index.ts': `
const a = 'a';
const one = 1;
console.log(a * one);
console.log(one * a);
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

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(newTestRun.new)).toEqual(['test']);

    const newTestRunResult = await readFile(resultsPath);

    expect(newTestRunResult).toMatchSnapshot();

    await writeFile(
      indexPath,
      `//\nconst a = 'a';\nconst one = 1;\nconsole.log(one * one);\nconsole.log(one * a);\nconsole.log(a * one);`
    );

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(sameTestRun.same)).toEqual(['test']);

    const sameTestRunResult = await readFile(resultsPath);

    expect(sameTestRunResult).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
