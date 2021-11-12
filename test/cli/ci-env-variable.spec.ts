import { start__ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer ci', () => {
  it('should work with `start` and the CI env variable', async () => {
    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('ci-env-variable', {
      'src/index.ts': `
const a = 'a';
const one = 1;
console.log(a * one);
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

    const fixturePath = paths.cwd;
    const indexPath = resolve('./src/index.ts');

    await start__(fixturePath, ARGV, false);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);\nconsole.log(a * one);`);

    process.env.CI = 'true';

    const suiteSummary = await start__(fixturePath, ARGV);

    expect(suiteSummary.changed).toHaveLength(1);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
