import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should report the status of the TypeScript compiler when there is a npm dependency', async () => {
    const { paths, logs, resolve, cleanup, writeFile, runNames } = await createFixture('typescript-dependency', {
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
    "resolveJsonModule": true,
    "strict": false
  },
  "include": ["./src/**/*", ".betterer.ts"]
}
        `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `import { ESLint } from 'eslint';\nconsole.log(ESLINT);`);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(newTestRun.new)).toEqual(['typescript']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
