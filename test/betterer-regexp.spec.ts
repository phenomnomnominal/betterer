import { betterer } from '@betterer/betterer/src';

import { fixture } from './fixture';

describe('betterer', () => {
  it('should report the existence of RegExp matches', async () => {
    const { logs, paths, readFile, reset, resolve, writeFile } = fixture(
      'test-betterer-regexp'
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(indexPath, `// HACK:`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['regexp no hack comments']);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['regexp no hack comments']);

    await writeFile(indexPath, `// HACK:;\n// HACK:;`);

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(worseTestRun.worse).toEqual(['regexp no hack comments']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(betterTestRun.better).toEqual(['regexp no hack comments']);

    const completedTestRun = await betterer({ configPaths, resultsPath });

    expect(completedTestRun.completed).toEqual(['regexp no hack comments']);

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
