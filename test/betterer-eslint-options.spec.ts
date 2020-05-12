import { betterer } from '@betterer/betterer';

import { fixture } from './fixture';

describe('betterer', () => {
  it('should handlex complex eslint rule options', async () => {
    const { logs, paths, readFile, reset, resolve, writeFile } = fixture('test-betterer-eslint-options');

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await reset();

    await writeFile(indexPath, `export default function foo () { };`);

    await betterer({ configPaths, resultsPath });

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
