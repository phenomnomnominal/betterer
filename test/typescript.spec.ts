import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should report the status of the TypeScript compiler', async () => {
    const { paths, logs, resolve, readFile, cleanup, writeFile, runNames } = await createFixture('typescript', {
      '.betterer.ts': `
import { typescript } from '@betterer/typescript';

export default {
  typescript: () => typescript('./tsconfig.json', {
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

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(newTestRun.new)).toEqual(['typescript']);

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(sameTestRun.same)).toEqual(['typescript']);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one, one * a);`);

    const worseTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(worseTestRun.worse)).toEqual(['typescript']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(betterTestRun.better)).toEqual(['typescript']);

    const completedTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(completedTestRun.completed)).toEqual(['typescript']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
