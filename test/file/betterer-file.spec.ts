import { betterer } from '@betterer/betterer';

import { createFixture } from '../fixture';

describe('betterer.file', () => {
  it('should run eslint against a file', async () => {
    const { paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-eslint-file', {
      '.betterer.js': `
const { eslint } = require('@betterer/eslint');

module.exports = {
  'eslint enable new rule': eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
};    
      `,
      '.eslintrc.js': `
const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    project: path.resolve(__dirname, './tsconfig.json'),
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    'no-debugger': 1
  }
};
      `,
      'tsconfig.json': `
{
  "extends": "../../tsconfig.json",
  "include": ["./src/**/*", "./.betterer.js", "./.eslintrc.js"]
}      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `debugger;`);

    const summary = await betterer.file(indexPath, { configPaths, resultsPath, cwd });
    const [run] = summary.runs;

    expect(run.isNew).toEqual(true);
    expect(run.filePaths).toEqual([indexPath]);

    await cleanup();
  });

  it('should ignore any files outside of the scope of the eslint test glob', async () => {
    const { paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-eslint-file-irrelevant', {
      '.betterer.js': `
const { eslint } = require('@betterer/eslint');

module.exports = {
  'eslint enable new rule': eslint({ 'no-debugger': 'error'}).include('./src/**/*.ts')
};    
      `,
      '.eslintrc.js': `
const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    project: path.resolve(__dirname, './tsconfig.json'),
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    'no-debugger': 1
  }
};
      `,
      'tsconfig.json': `
{
  "extends": "../../tsconfig.json",
  "include": ["./src/**/*", "./.betterer.js", "./.eslintrc.js"]
}      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const testFile = resolve('./test/index.ts');

    await writeFile(testFile, `debugger;`);

    const summary = await betterer.file(testFile, { configPaths, resultsPath, cwd });
    const [run] = summary.runs;

    expect(run.isComplete).toEqual(true);
    expect(run.filePaths).toEqual([testFile]);

    await cleanup();
  });

  it('should run regexp against a file', async () => {
    const { paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-regexp-file', {
      '.betterer.js': `
const { regexp } = require('@betterer/regexp');

module.exports = {
  'regexp no hack comments': regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `// HACK:`);

    const summary = await betterer.file(indexPath, { configPaths, resultsPath, cwd });
    const [run] = summary.runs;

    expect(run.isNew).toEqual(true);
    expect(run.filePaths).toEqual([indexPath]);

    await cleanup();
  });

  it('should ignore any files outside of the scope of the regexp test glob', async () => {
    const { paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-regexp-file-irrelevant', {
      '.betterer.js': `
const { regexp } = require('@betterer/regexp');

module.exports = {
  'regexp no hack comments': regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const testFile = resolve('./test/index.ts');

    await writeFile(testFile, `// HACK:`);

    const summary = await betterer.file(testFile, { configPaths, resultsPath, cwd });
    const [run] = summary.runs;

    expect(run.isComplete).toEqual(true);
    expect(run.filePaths).toEqual([testFile]);

    await cleanup();
  });

  it('should run tsquery against a file', async () => {
    const { paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-tsquery-file', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': tsquery(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
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
    const { cwd } = paths;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `console.log('foo');`);

    const summary = await betterer.file(indexPath, { configPaths, resultsPath, cwd });
    const [run] = summary.runs;

    expect(run.isNew).toEqual(true);
    expect(run.filePaths).toEqual([indexPath]);

    await cleanup();
  });

  it('should ignore any files outside of the scope of the tsquery tsconfig', async () => {
    const { paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-tsquery-file-irrevelent', {
      '.betterer.ts': `
import { tsquery } from '@betterer/tsquery';

export default {
  'tsquery no raw console.log': tsquery(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
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
    const { cwd } = paths;
    const testPath = resolve('./test/index.ts');

    await writeFile(testPath, `console.log('foo');`);

    const summary = await betterer.file(testPath, { configPaths, resultsPath, cwd });
    const [run] = summary.runs;

    expect(run.isNew).toEqual(true);
    expect(run.filePaths).toEqual([testPath]);

    await cleanup();
  });

  it('should run typescript against a file', async () => {
    const { paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-typescript-file', {
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

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const summary = await betterer.file(indexPath, { configPaths, resultsPath, cwd });
    const [run] = summary.runs;

    expect(run.isNew).toEqual(true);
    expect(run.filePaths).toEqual([indexPath]);

    await cleanup();
  });

  it('should ignore any files outside of the scope of the typescript tsconfig', async () => {
    const { paths, resolve, cleanup, writeFile } = await createFixture('test-betterer-typescript-file-irrelevent', {
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

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const testPath = resolve('./test/index.ts');

    await writeFile(testPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const summary = await betterer.file(testPath, { configPaths, resultsPath, cwd });
    const [run] = summary.runs;

    expect(run.isNew).toEqual(true);
    expect(run.filePaths).toEqual([testPath]);

    await cleanup();
  });
});
