import { precommitΔ, startΔ } from '@betterer/cli';
import simpleGit from 'simple-git';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer precommit', () => {
  it('should add the results file to the changeset if there is any change to the results file', async () => {
    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('test-betterer-precommit', {
      'src/index.ts': `
const a = 'a';
const one = 1;
console.log(a * one);
      `,
      '.betterer.ts': `
import { typescript } from '@betterer/typescript';

export default {
  'typescript use strict mode': () => typescript('./tsconfig.json', {
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

    await startΔ(fixturePath, ARGV);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);`);

    await precommitΔ(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    const git = simpleGit();
    await git.init();
    const status = await git.status([paths.results]);
    const [stagedResultsPath] = status.staged;
    expect(stagedResultsPath).toMatchSnapshot();

    await git.reset([resultsPath]);

    await cleanup();
  });

  it('should not update the changeset when a test gets worse', async () => {
    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('test-betterer-precommit-worse', {
      'src/index.ts': `
const a = 'a';
const one = 1;
console.log(a * one);
      `,
      '.betterer.ts': `
import { typescript } from '@betterer/typescript';

export default {
  'typescript use strict mode': () => typescript('./tsconfig.json', {
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

    await startΔ(fixturePath, ARGV);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one * a);\nconsole.log(a * one);`);

    const suiteSummary = await precommitΔ(fixturePath, ARGV);

    expect(suiteSummary.worse).toHaveLength(1);

    expect(logs).toMatchSnapshot();

    const git = simpleGit();
    await git.init();
    const status = await git.status([paths.results]);
    expect(status.staged).toEqual([]);

    await cleanup();
  });
});
