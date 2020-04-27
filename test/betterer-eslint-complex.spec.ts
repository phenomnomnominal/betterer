import { betterer } from '@betterer/betterer/src';

import { fixture } from './fixture';

function eslintComplexFixture(): ReturnType<typeof fixture> {
  const init = fixture('test-betterer-eslint-complex');
  const { deleteFile, paths, resolve } = init;
  const indexPath = resolve('./src/index.ts');
  async function reset(): Promise<void> {
    try {
      await deleteFile(indexPath);
    } catch {
      // Moving on...
    }
    try {
      await deleteFile(paths.results);
    } catch {
      // Moving on...
    }
  }
  return { ...init, reset };
}

describe('betterer', () => {
  it('should report the status of a new eslint rule with a complex set up', async () => {
    const { logs, paths, readFile, reset, resolve, writeFile } = eslintComplexFixture();

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(indexPath, `debugger;`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['eslint enable no-debugger rule']);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['eslint enable no-debugger rule']);

    await writeFile(indexPath, `debugger;\ndebugger;`);

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(worseTestRun.worse).toEqual(['eslint enable no-debugger rule']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(betterTestRun.better).toEqual(['eslint enable no-debugger rule']);

    const completedTestRun = await betterer({ configPaths, resultsPath });

    expect(completedTestRun.completed).toEqual(['eslint enable no-debugger rule']);

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
