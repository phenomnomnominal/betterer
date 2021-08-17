import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should skip a test', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixture(
      'test-betterer-skip',
      {
        '.betterer.skip.ts': `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
import { regexp } from '@betterer/regexp';
import { persist } from '@betterer/fixture';

const grows = persist(__dirname, 'grows', 0);

export default {
  'test 1': () => new BettererTest({
    test: () => grows.increment(),
    constraint: bigger
  }).skip(),
  'test 2': () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts').skip()
};
      `,
        '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
import { regexp } from '@betterer/regexp';
import { persist } from '@betterer/fixture';

const grows = persist(__dirname, 'grows', 0);

export default {
  'test 1': () => new BettererTest({
    test: () => grows.increment(),
    constraint: bigger
  }),
  'test 2': () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};
      `
      },
      {
        logFilters: [/: running /, /running.../]
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `// HACK:`);

    const run = await betterer({ configPaths, resultsPath, workers: 1 });

    expect(runNames(run.ran)).toEqual(['test 1', 'test 2']);
    expect(runNames(run.skipped)).toEqual([]);

    const skipRun = await betterer({ configPaths: [resolve('./.betterer.skip.ts')], resultsPath, workers: 1 });

    expect(runNames(skipRun.ran)).toEqual([]);
    expect(runNames(skipRun.skipped)).toEqual(['test 1', 'test 2']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
