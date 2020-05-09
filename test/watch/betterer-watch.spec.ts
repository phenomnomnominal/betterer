import { betterer } from '@betterer/betterer';

import { fixture } from '../fixture';

describe('betterer.watch', () => {
  it('should run in watch mode', async () => {
    const { logs, paths, resolve, reset, writeFile, waitForRun } = fixture('test-betterer-watch');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const { cwd } = paths;

    await reset();

    await writeFile(indexPath, `console.log('foo');console.log('foo');`);

    await betterer({ configPaths, resultsPath, cwd });

    const watcher = await betterer.watch({ configPaths, resultsPath, cwd });

    await writeFile(indexPath, `console.log('foo');\nconsole.log('foo');console.log('foo');`);

    const [worseRun] = await waitForRun(watcher);

    expect(worseRun.isWorse).toBe(true);

    await writeFile(indexPath, `console.log('foo');console.log('foo');`);

    const [sameRun] = await waitForRun(watcher);

    expect(sameRun.isSame).toBe(true);

    await writeFile(indexPath, `console.log('bar');`);

    const [betterRun] = await waitForRun(watcher);

    expect(betterRun.isBetter).toBe(true);

    await watcher.stop();

    expect(logs).toMatchSnapshot();

    await reset();
  });

  it('should debounce runs when multiple files change', async () => {
    const { logs, paths, resolve, reset, writeFile, waitForRun } = fixture('test-betterer-watch-debounce');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const filePath = resolve('./src/file.ts');
    const { cwd } = paths;

    await reset();

    const watcher = await betterer.watch({ configPaths, resultsPath, cwd });

    await writeFile(indexPath, `console.log('foo');`);
    await writeFile(filePath, `console.log('foo');\nconsole.log('foo');`);
    const runs = await waitForRun(watcher);

    await watcher.stop();

    expect(runs).toHaveLength(1);

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
