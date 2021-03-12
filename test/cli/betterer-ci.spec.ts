import { ciΔ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer ci', () => {
  it('should add a diff to the summary if there is any change to the results file', async () => {
    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('test-betterer-ci-diff', {
      'src/index.ts': `
const a = 'a';
const one = 1;
console.log(a * one);
      `,
      '.betterer.ts': `
import { typescript } from '@betterer/typescript';

export default {
  'typescript use strict mode': typescript('./tsconfig.json', {
    strict: true
  })
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

    await ciΔ(fixturePath, ARGV);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);\nconsole.log(a * one);`);

    const diffSummary = await ciΔ(fixturePath, ARGV);

    expect(diffSummary.expected).not.toBeNull();
    expect(diffSummary.unexpectedDiff).toEqual(true);
    expect(diffSummary.worse).toHaveLength(0);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should work when a test gets worse', async () => {
    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('test-betterer-ci-diff', {
      'src/index.ts': `
const a = 'a';
const one = 1;
console.log(a * one);
      `,
      '.betterer.ts': `
import { typescript } from '@betterer/typescript';

export default {
  'typescript use strict mode': typescript('./tsconfig.json', {
    strict: true
  })
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

    await ciΔ(fixturePath, ARGV);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one * a);\nconsole.log(a * one);`);

    const diffSummary = await ciΔ(fixturePath, ARGV);

    expect(diffSummary.expected).not.toBeNull();
    expect(diffSummary.unexpectedDiff).toEqual(false);
    expect(diffSummary.worse.length).toBeGreaterThan(0);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
