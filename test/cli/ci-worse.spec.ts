import { describe, it, expect } from 'vitest';

import { createFixture } from '../fixture.js';

const ARGV = ['node', './bin/betterer'];

describe('betterer ci', () => {
  it('should work when a test gets worse', async () => {
    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('ci-worse', {
      'src/index.ts': `
const a = 'a';
const one = 1;
console.log(a * one);
      `,
      '.betterer.js': `
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

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, [...ARGV, 'start', '--workers=false'], false);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one * a);\nconsole.log(a * one);`);

    await cli__(fixturePath, [...ARGV, 'ci', '--workers=false']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
