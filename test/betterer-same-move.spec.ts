import { betterer } from '@betterer/betterer/src';
import { fixture } from './fixture';

describe('betterer', () => {
  it('should stay the same when a file is moved', async () => {
    const { deleteFile, paths, logs, reset, resolve, writeFile } = fixture(
      'test-betterer-same-move'
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const movedPath = resolve('./src/moved.ts');

    await reset();

    await writeFile(
      indexPath,
      `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`
    );

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(newTestRun.new).toEqual(['typescript use strict mode']);

    await writeFile(
      movedPath,
      `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`
    );
    await deleteFile(indexPath);

    const sameTestRun = await betterer({ configPaths, resultsPath });

    expect(sameTestRun.same).toEqual(['typescript use strict mode']);

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
