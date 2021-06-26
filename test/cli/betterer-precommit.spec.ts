import { precommitΔ, startΔ } from '@betterer/cli';
import { jest } from '@jest/globals';
import simpleGit, { Response, SimpleGit } from 'simple-git';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer precommit', () => {
  it('should add a diff to the summary if there is any change to the results file', async () => {
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

    // Mock `git add` so it doesn't break everything:
    const git = simpleGit();
    const spy = jest
      .spyOn(git.constructor.prototype as SimpleGit, 'add')
      .mockImplementation(function (this: SimpleGit) {
        return this as Response<string>;
      });

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);\nconsole.log(a * one);`);

    await startΔ(fixturePath, ARGV);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);`);

    await precommitΔ(fixturePath, ARGV);

    expect(spy).toHaveBeenCalledWith(resultsPath);

    expect(logs).toMatchSnapshot();

    await cleanup();
    spy.mockRestore();
  });

  it('should throw when a test gets worse', async () => {
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

    // Mock `git add` so it doesn't break everything:
    const git = simpleGit();
    const spy = jest
      .spyOn(git.constructor.prototype as SimpleGit, 'add')
      .mockImplementation(function (this: SimpleGit) {
        return this as Response<string>;
      });

    await startΔ(fixturePath, ARGV);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one * a);\nconsole.log(a * one);`);

    const diffSummary = await precommitΔ(fixturePath, ARGV);

    expect(diffSummary.worse).toHaveLength(1);

    expect(spy).not.toHaveBeenCalled();

    expect(logs).toMatchSnapshot();

    await cleanup();
    spy.mockRestore();
  });
});
