import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should report the status of the TypeScript compiler', async () => {
    const { paths, logs, resolve, readFile, cleanup, writeFile, runNames } = await createFixture(
      'test-betterer-typescript',
      {
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
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(newTestRun.new)).toEqual(['typescript use strict mode']);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(sameTestRun.same)).toEqual(['typescript use strict mode']);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one, one * a);`);

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(worseTestRun.worse)).toEqual(['typescript use strict mode']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(betterTestRun.better)).toEqual(['typescript use strict mode']);

    const completedTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(completedTestRun.completed)).toEqual(['typescript use strict mode']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should throw if there is no configFilePath', async () => {
    const { paths, logs, cleanup } = await createFixture('test-betterer-typescript-no-config-file-path', {
      '.betterer.js': `
const { typescript } = require('@betterer/typescript');

module.exports = {
  'typescript use strict mode': () => typescript()
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should report the status of the TypeScript compiler when there is a npm dependency', async () => {
    const { paths, logs, resolve, cleanup, writeFile, runNames } = await createFixture(
      'test-betterer-typescript-dependency',
      {
        '.betterer.ts': `
import { typescript } from '@betterer/typescript';

export default {
  'typescript dependency': () => typescript('./tsconfig.json', {
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
    "resolveJsonModule": true,
    "strict": false
  },
  "include": ["./src/**/*", ".betterer.ts"]
}
        `
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `import { ESLint } from 'eslint';\nconsole.log(ESLINT);`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(newTestRun.new)).toEqual(['typescript dependency']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should work with an incremental build', async () => {
    const { paths, logs, resolve, cleanup, readFile, writeFile, runNames } = await createFixture(
      'test-betterer-typescript-incremental',
      {
        '.betterer.ts': `
import { typescript } from '@betterer/typescript';

export default {
  'typescript incremental': () => typescript('./tsconfig.json', {
    incremental: true,
    tsBuildInfoFile: './.betterer.tsbuildinfo'
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
    "resolveJsonModule": true,
    "strict": false
  },
  "include": ["./src/**/*.ts", ".betterer.ts"]
}
        `,
        './src/foo.ts': `
import { bar } from './bar'; 

export function foo (a: number, b: number, c:number) {
  return bar(a * 2, b * 2, c * 2);
}
        `,
        './src/bar.ts': `
export function bar (a: number, b: number, c:number) {
  return (a * b) ** c;
}
        `
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const buildInfoPath = resolve('./.betterer.tsbuildinfo');

    await writeFile(indexPath, `import { foo } from './foo';\n\nfoo('a', 'b', 'c');`);

    const newStart = new Date().getTime();
    const newTestRun = await betterer({ configPaths, resultsPath });
    const newTime = new Date().getTime() - newStart;

    expect(runNames(newTestRun.new)).toEqual(['typescript incremental']);

    const buildInfo = await readFile(buildInfoPath);

    expect(buildInfo).not.toBeNull();

    const sameStart = new Date().getTime();
    const sameTestRun = await betterer({ configPaths, resultsPath });
    const sameTime = new Date().getTime() - sameStart;

    expect(sameTime).toBeLessThan(newTime);

    expect(runNames(sameTestRun.same)).toEqual(['typescript incremental']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
