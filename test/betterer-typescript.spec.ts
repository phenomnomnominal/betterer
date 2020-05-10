import { betterer } from '@betterer/betterer';
import { fixture } from './fixture';

describe('betterer', () => {
  it('should report the status of the TypeScript compiler', async () => {
    const { paths, logs, resolve, readFile, reset, writeFile } = fixture('test-betterer-typescript');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['typescript use strict mode']);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['typescript use strict mode']);

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one, one * a);`);

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(worseTestRun.worse).toEqual(['typescript use strict mode']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(indexPath, ``);

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(betterTestRun.better).toEqual(['typescript use strict mode']);

    const completedTestRun = await betterer({ configPaths, resultsPath });

    expect(completedTestRun.completed).toEqual(['typescript use strict mode']);

    expect(logs).toMatchSnapshot();

    await reset();
  });

  it('should throw if there is no configFilePath', async () => {
    const { paths, logs, reset } = fixture('test-betterer-typescript-no-config-file-path');

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await reset();
  });

  it('should throw if there is no extraCompilerOptions', async () => {
    const { paths, logs, reset } = fixture('test-betterer-typescript-no-compiler-options');

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
