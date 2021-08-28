import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should handle a global exclude', async () => {
    const { logs, paths, deleteFile, readFile, cleanup, resolve, writeFile } = await createFixture('exclude-global', {
      '.betterer.ts': `
import { regexp } from '@betterer/regexp';

export default {
  test: () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};      
      `,
      '.betterer.exclude.ts': `
import { regexp } from '@betterer/regexp';

export default {
  test: () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts').exclude(/exclude.ts/)
};      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await writeFile(resolve('./src/index.ts'), '// Hack');
    await writeFile(resolve('./src/exclude.ts'), '// Hack');
    await writeFile(resolve('./src/global.ts'), '// Hack');

    await betterer({ configPaths, cwd: paths.cwd, resultsPath, workers: false });

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await deleteFile(resultsPath);

    await betterer({
      configPaths,
      cwd: paths.cwd,
      excludes: [/global.ts/],
      includes: ['./src/**/*.ts'],
      resultsPath,
      workers: false
    });

    const globalExcludeResult = await readFile(resultsPath);

    expect(globalExcludeResult).toMatchSnapshot();

    await betterer({
      configPaths: [resolve('./.betterer.exclude.ts')],
      cwd: paths.cwd,
      excludes: [/global.ts/],
      includes: ['./src/**/*.ts'],
      resultsPath,
      workers: false
    });

    const excludeResult = await readFile(resultsPath);

    expect(excludeResult).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
