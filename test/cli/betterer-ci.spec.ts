import { ciΔ, startΔ } from '@betterer/cli';
import { unexpectedDiff } from '@betterer/reporter/dist/messages';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer ci', () => {
  it('should add a diff to the summary if there is any change to the results file', async () => {
    let indexTs = `
const a = 'a';
const one = 1;
`;

    // Test not outputting entire results file (snapshot)
    for (let i = 0; i < 1000; i++) {
      indexTs += 'console.log(a * one);\n';
    }

    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('test-betterer-ci-diff', {
      'src/index.ts': indexTs,
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

    await writeFile(indexPath, indexTs.split('\n').slice(0, 990).join('\n'));

    const diffSummary = await ciΔ(fixturePath, ARGV);

    expect(diffSummary.expected).not.toBeNull();
    expect(diffSummary.unexpectedDiff).toEqual(true);
    expect(diffSummary.worse).toHaveLength(0);

    expect(logs[logs.length - 1].split('\n').length).toBeLessThan(100);
    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should work with `start` and the CI env variable', async () => {
    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('test-betterer-ci-start', {
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

    process.env.CI = '1';

    await startΔ(fixturePath, ARGV);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);\nconsole.log(a * one);`);

    const diffSummary = await startΔ(fixturePath, ARGV);

    expect(diffSummary.expected).not.toBeNull();
    expect(diffSummary.unexpectedDiff).toEqual(true);
    expect(diffSummary.worse).toHaveLength(0);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should work when a test gets worse', async () => {
    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('test-betterer-ci-worse', {
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

  it('should not output diff if any tests got worse', async () => {
    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('test-betterer-ci-worse-no-diff', {
      'src/index.ts': `
const a = 'a';
const one = 1;
debugger;
console.log(a * one);
      `,
      '.betterer.ts': `
import { typescript } from '@betterer/typescript';
import { eslint } from '@betterer/eslint';

export default {
  'typescript use strict mode': typescript('./tsconfig.json', {
    strict: true
  }),
  'eslint no debugger': eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
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

    await ciΔ(fixturePath, ARGV);

    await writeFile(
      resolve('./src/index.ts'),
      `const a = 'a';\nconst one = 1;\ndebugger;\n\nconsole.log(a * one);debugger;`
    );

    const diffSummary = await ciΔ(fixturePath, ARGV);

    expect(diffSummary.unexpectedDiff).toBe(true);
    expect(logs.join('\n')).not.toContain(unexpectedDiff());

    await cleanup();
  });
});
