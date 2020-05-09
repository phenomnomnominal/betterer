import { betterer, BettererFiles } from '@betterer/betterer';

import { fixture } from '../fixture';

describe('betterer.watch', () => {
  it('should tsquery run in watch mode', async () => {
    const { logs, paths, resolve, reset, writeFile, waitForRun } = fixture('test-betterer-watch');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const { cwd } = paths;

    await reset();

    const watcher = await betterer.watch({ configPaths, resultsPath, cwd });

    await writeFile(indexPath, `console.log('foo');`);
    const [firstRun] = await waitForRun(watcher);
    await writeFile(indexPath, `console.log('foo');\nconsole.log('foo');`);
    const [secondRun] = await waitForRun(watcher);
    await writeFile(indexPath, ``);
    const [thirdRun] = await waitForRun(watcher);

    await watcher.stop();

    expect((firstRun.result as BettererFiles<unknown>).files[0].fileIssues).toHaveLength(1);
    expect((secondRun.result as BettererFiles<unknown>).files[0].fileIssues).toHaveLength(2);
    expect((thirdRun.result as BettererFiles<unknown>).files).toHaveLength(0);

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
