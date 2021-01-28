import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it(`should work when a test is the same`, async () => {
    const { paths, logs, readFile, cleanup, runNames } = await createFixture('test-betterer-same', {
      '.betterer.js': `
const { bigger, smaller } = require('@betterer/constraints');

let start = 0;

module.exports = {
  [\`doesn't get bigger\`]: {
    test: () => start,
    constraint: bigger
  },
  [\`doesn't get smaller\`]: {
    test: () => start,
    constraint: smaller
  }
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(runNames(firstRun.new)).toEqual([`doesn't get bigger`, `doesn't get smaller`]);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(runNames(secondRun.same)).toEqual([`doesn't get bigger`, `doesn't get smaller`]);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });

  it('should stay the same when a file is moved', async () => {
    const { deleteFile, paths, logs, cleanup, resolve, readFile, writeFile, runNames } = await createFixture(
      'test-betterer-same-move',
      {
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
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const movedPath = resolve('./src/moved.ts');

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(newTestRun.new)).toEqual(['typescript use strict mode']);

    const newTestRunResult = await readFile(resultsPath);

    expect(newTestRunResult).toMatchSnapshot();

    await writeFile(movedPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);
    await deleteFile(indexPath);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(sameTestRun.same)).toEqual(['typescript use strict mode']);

    const sameTestRunResult = await readFile(resultsPath);

    expect(sameTestRunResult).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should stay the same when an issue moves line', async () => {
    const { paths, logs, cleanup, resolve, readFile, writeFile, runNames } = await createFixture(
      'test-betterer-same-move-line',
      {
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
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(newTestRun.new)).toEqual(['typescript use strict mode']);

    const newTestRunResult = await readFile(resultsPath);

    expect(newTestRunResult).toMatchSnapshot();

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(one + one);\nconsole.log(a * one);`);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(sameTestRun.same)).toEqual(['typescript use strict mode']);

    const sameTestRunResult = await readFile(resultsPath);

    expect(sameTestRunResult).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should stay the same when multiple issue move line', async () => {
    const { paths, logs, cleanup, resolve, readFile, writeFile, runNames } = await createFixture(
      'test-betterer-same-move-multiple',
      {
        'src/index.ts': `
const a = 'a';
const one = 1;
console.log(a * one);
console.log(one * a);
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
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(newTestRun.new)).toEqual(['typescript use strict mode']);

    const newTestRunResult = await readFile(resultsPath);

    expect(newTestRunResult).toMatchSnapshot();

    await writeFile(
      indexPath,
      `//\nconst a = 'a';\nconst one = 1;\nconsole.log(one * one);\nconsole.log(a * one);\nconsole.log(one * a);`
    );

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(sameTestRun.same)).toEqual(['typescript use strict mode']);

    const sameTestRunResult = await readFile(resultsPath);

    expect(sameTestRunResult).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
