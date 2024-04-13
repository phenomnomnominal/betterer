import { simpleGit } from 'simple-git';

// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer precommit', () => {
  it('should add the results file to the changeset if there is any change to the results file', async () => {
    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('precommit-add', {
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

    const resultsPath = paths.results;
    const fixturePath = paths.cwd;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);\nconsole.log(a * one);`);

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, [...ARGV, 'start', '--workers=0'], false);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);`);

    await cli__(fixturePath, [...ARGV, 'precommit', '--workers=0']);

    expect(process.exitCode).toBeUndefined();

    expect(logs).toMatchSnapshot();

    const git = simpleGit();
    await git.init();
    const status = await git.status([paths.results]);
    const [stagedResultsPath] = status.staged;
    expect(stagedResultsPath).toMatchSnapshot();

    await git.reset([resultsPath]);

    await cleanup();
  });
});
