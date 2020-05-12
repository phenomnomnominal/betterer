import { betterer } from '@betterer/betterer';
import { createFixture } from './fixture';

describe('betterer', () => {
  it(`should work when a test is the same`, async () => {
    const { paths, logs, readFile, cleanup } = await createFixture('test-betterer-same', {
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

    expect(firstRun.new).toEqual([`doesn't get bigger`, `doesn't get smaller`]);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(secondRun.same).toEqual([`doesn't get bigger`, `doesn't get smaller`]);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });

  it('should stay the same when a file is moved', async () => {
    const { deleteFile, paths, logs, cleanup, resolve, writeFile } = await createFixture('test-betterer-same-move', {
      'src/index.ts': `
const a = 'a';
const one = 1;
console.log(a * one);
      `,
      '.betterer.ts': `
import { typescriptBetterer } from '@betterer/typescript';

export default {
  'typescript use strict mode': typescriptBetterer('./tsconfig.json', {
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

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const movedPath = resolve('./src/moved.ts');

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['typescript use strict mode']);

    await writeFile(movedPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);
    await deleteFile(indexPath);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['typescript use strict mode']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should stay the same when an issue moves line', async () => {
    const { paths, logs, cleanup, resolve, writeFile } = await createFixture('test-betterer-same-move', {
      'src/index.ts': `
const a = 'a';
const one = 1;
console.log(a * one);
      `,
      '.betterer.ts': `
import { typescriptBetterer } from '@betterer/typescript';

export default {
  'typescript use strict mode': typescriptBetterer('./tsconfig.json', {
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

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['typescript use strict mode']);

    await writeFile(indexPath, `\n\nconst a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['typescript use strict mode']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
