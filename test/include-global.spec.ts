import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should handle a global include', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile } = await createFixture('include-global', {
      '.betterer.ts': `
import { regexp } from '@betterer/regexp';

export default {
  test: () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/index.ts')
};      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');
    const globalPath = resolve('./src/global.ts');

    await writeFile(indexPath, '// Hack');
    await writeFile(globalPath, '// Hack');

    await betterer({ configPaths, cwd: paths.cwd, resultsPath, workers: false });

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    const globalIncludeSummary = await betterer({
      configPaths,
      cwd: paths.cwd,
      includes: ['./src/global.ts'],
      resultsPath,
      workers: false,
      update: true
    });

    expect(globalIncludeSummary.filePaths).toEqual([globalPath]);

    const globalExcludeResult = await readFile(resultsPath);

    expect(globalExcludeResult).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
