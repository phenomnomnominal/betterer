import { betterer } from '@betterer/betterer';
import { fixture } from './fixture';

describe('betterer', () => {
  it(`should work when a test is the same`, async () => {
    const { paths, logs, readFile, reset } = fixture('test-betterer-same');

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await reset();

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(firstRun.new).toEqual([`doesn't get bigger`, `doesn't get smaller`]);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(secondRun.same).toEqual([`doesn't get bigger`, `doesn't get smaller`]);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await reset();
  });

  it('should stay the same when a file is moved', async () => {
    const { deleteFile, paths, logs, reset, resolve, writeFile } = fixture('test-betterer-same-move');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const movedPath = resolve('./src/moved.ts');

    await reset();

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['typescript use strict mode']);

    await writeFile(movedPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);
    await deleteFile(indexPath);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['typescript use strict mode']);

    expect(logs).toMatchSnapshot();

    await reset();
  });

  it('should stay the same when an issue moves line', async () => {
    const { paths, logs, reset, resolve, writeFile } = fixture('test-betterer-same-move');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['typescript use strict mode']);

    await writeFile(indexPath, `\n\nconst a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['typescript use strict mode']);

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
