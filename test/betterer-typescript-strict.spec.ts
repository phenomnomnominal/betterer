import { betterer } from '@betterer/betterer/src';
import { fixture } from './fixture';

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
    const { paths, logs, resolve, readFile, reset, writeFile } = fixture('test-betterer-typescript-strict');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(indexPath, INDEX_SOURCE);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['typescript use strict mode']);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['typescript use strict mode']);

    await writeFile(indexPath, `${INDEX_SOURCE}\nconst a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(worseTestRun.worse).toEqual(['typescript use strict mode']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, INDEX_SOURCE.replace('sum.apply(null, [1, 2, 3]);', 'sum.apply(null, [1, 2]);'));

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(betterTestRun.better).toEqual(['typescript use strict mode']);

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
