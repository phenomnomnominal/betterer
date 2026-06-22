import { describe, it, expect } from 'vitest';

import { createFixture } from '../fixture.js';

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

    const { cliΔ } = await import('@betterer/cli');

    await cliΔ(fixturePath, [...ARGV, 'start', '--workers=false'], false);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);\nconsole.log(a * one);`);

    process.env.CI = 'true';

    await expect(async () => {
      await cliΔ(fixturePath, [...ARGV, 'start', '--workers=false']);
    }).rejects.toThrow('Unexpected changes detected while running in CI mode. ❌');

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should not set the CI env variable when validation fails', async () => {
    const { paths, cleanup } = await createFixture('ci-env-variable-invalid', { '.betterer.ts': `export default {};` });

    const before = process.env.CI;
    delete process.env.CI;

    const { betterer } = await import('@betterer/betterer');
    try {
      // @ts-expect-error workers must be a number or boolean
      await betterer({ configPaths: [paths.config], resultsPath: paths.results, ci: true, workers: 'nope' });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toContain('"workers" must be a number');
    }
    expect(process.env.CI).toBeUndefined();

    if (before === undefined) {
      delete process.env.CI;
    } else {
      process.env.CI = before;
    }
    await cleanup();
  });
});
