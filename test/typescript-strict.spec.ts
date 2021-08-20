import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

const INDEX_SOURCE = `export function extractIds(list) {
  return list.map(member => member.id);
}

function bar() {
  return this.baz.toUpperCase();
}

const foo = {
  baz: 'baz',
  bar
};

foo.bar();

export function findNumberFixed(numbers: Array<number>, search: number) {
  const number = numbers.find(n => n === search);
  return number.toFixed(2);
}

export class Foo {
  private bar: number;
  constructor() {}
}

export function sum(num1: number, num2: number) {
  return num1 + num2;
}

sum.apply(null, [1, 2, 3]);
`;

describe('betterer', () => {
  it('should report the status of the TypeScript compiler in strict mode', async () => {
    const { paths, logs, resolve, readFile, cleanup, writeFile, runNames } = await createFixture('typescript-strict', {
      '.betterer.ts': `
import { typescript } from '@betterer/typescript';

export default {
  typescript: () => typescript('./tsconfig.json', {
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
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, INDEX_SOURCE);

    const newTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(newTestRun.new)).toEqual(['typescript']);

    const sameTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(sameTestRun.same)).toEqual(['typescript']);

    await writeFile(indexPath, `${INDEX_SOURCE}\nconst a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const worseTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(worseTestRun.worse)).toEqual(['typescript']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, INDEX_SOURCE.replace('sum.apply(null, [1, 2, 3]);', 'sum.apply(null, [1, 2]);'));

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(betterTestRun.better)).toEqual(['typescript']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
