import { createFixture } from '../fixture';

import { cli__ } from '@betterer/cli';

const ARGV = ['node', './bin/betterer'];

describe('betterer ci', () => {
  it('should work when a test is already complete', async () => {
    const { paths, logs, cleanup, readFile, resolve, writeFile } = await createFixture('ci-complete', {
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
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await cli__(fixturePath, [...ARGV, 'start'], false);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    await cli__(fixturePath, [...ARGV, 'start'], false);

    const completeResult = await readFile(resultsPath);

    expect(completeResult).toMatchSnapshot();

    await cli__(fixturePath, [...ARGV, 'ci']);

    expect(logs).toMatchSnapshot();

    const ciResult = await readFile(resultsPath);

    expect(ciResult).toMatchSnapshot();

    await cleanup();
  });
});
