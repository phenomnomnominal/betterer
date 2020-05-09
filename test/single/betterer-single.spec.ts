import { betterer } from '@betterer/betterer';

import { fixture } from '../fixture';

describe('betterer.single', () => {
  it('should run eslint against a single file', async () => {
    const { paths, resolve, reset, writeFile } = fixture('test-betterer-eslint-single');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(indexPath, `debugger;`);

    const [run] = await betterer.single({ configPaths, resultsPath, cwd }, indexPath);

    expect(run.isNew).toEqual(true);
    expect(run.files).toEqual([indexPath]);

    await reset();
  });

  it('should run regexp against a single file', async () => {
    const { paths, resolve, reset, writeFile } = fixture('test-betterer-regexp-single');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(indexPath, `// HACK:`);

    const [run] = await betterer.single({ configPaths, resultsPath, cwd }, indexPath);

    expect(run.isNew).toEqual(true);
    expect(run.files).toEqual([indexPath]);

    await reset();
  });

  it('should run tsquery against a single file', async () => {
    const { paths, resolve, reset, writeFile } = fixture('test-betterer-tsquery-single');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(indexPath, `console.log('foo');`);

    const [run] = await betterer.single({ configPaths, resultsPath, cwd }, indexPath);

    expect(run.isNew).toEqual(true);
    expect(run.files).toEqual([indexPath]);

    await reset();
  });

  it('should run typescript against a single file', async () => {
    const { paths, resolve, reset, writeFile } = fixture('test-betterer-typescript-single');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const { cwd } = paths;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(indexPath, `const a = 'a';\nconst one = 1;\nconsole.log(a * one);`);

    const [run] = await betterer.single({ configPaths, resultsPath, cwd }, indexPath);

    expect(run.isNew).toEqual(true);
    expect(run.files).toEqual([indexPath]);

    await reset();
  });
});
