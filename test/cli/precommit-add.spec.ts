import type { SimpleGit, SimpleGitFactory } from 'simple-git';

type SimpleGitModule = typeof import('simple-git');

import { describe, it, expect, vi, vitest } from 'vitest';

import { createFixture } from '../fixture.js';

const gitAddMock = vi.fn<SimpleGit['add']>();

vitest.mock('simple-git', async (importOriginal): Promise<SimpleGitModule> => {
  const sg = await importOriginal<SimpleGitModule>();
  const simpleGit = ((...args: Parameters<SimpleGitFactory>) => {
    const instance = sg.simpleGit(...args);
    instance.add = gitAddMock;
    return instance;
  }) as SimpleGitFactory;
  return { ...sg, simpleGit };
});

const ARGV = ['node', './bin/betterer'];

describe('betterer precommit', () => {
  it('should add the results file to the changeset if there is any change to the results file', async () => {
    const { cliΔ } = await import('@betterer/cli');

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
    "lib": ["esnext", "dom"],
    "moduleResolution": "node",
    "target": "ES5",
    "typeRoots": [],
    "resolveJsonModule": true
  },
  "include": ["./src/**/*"]
}
      `
    });

    const fixturePath = paths.cwd;
    const indexPath = resolve('./src/index.ts');

    process.env.BETTERER_WORKER = 'false';

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);\nconsole.log(a * one);`);

    await cliΔ(fixturePath, [...ARGV, 'start', '--workers=false'], false);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);`);

    await cliΔ(fixturePath, [...ARGV, 'precommit', '--workers=false', '--repoPath=../../']);

    expect(logs).toMatchSnapshot();

    expect(gitAddMock).toHaveBeenCalledWith(paths.results);

    await cleanup();
  });
});
