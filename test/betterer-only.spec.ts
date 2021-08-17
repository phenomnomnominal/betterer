import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should run specific tests', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixture(
      'test-betterer-only',
      {
        '.betterer.only.ts': `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
import { regexp } from '@betterer/regexp';

export default {
  'test 1': () => new BettererTest({
    test: () => 0,
    constraint: bigger
  }).only(),
  'test 2': () => new BettererTest({
    test: () => 0,
    constraint: bigger
  }),
  'test 3': () => new BettererTest({
    test: () => 0,
    constraint: bigger
  }),
  'test 4': () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts').only()
};
        `,
        '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
import { regexp } from '@betterer/regexp';

export default {
  'test 1': () => new BettererTest({
    test: () => 0,
    constraint: bigger
  }),
  'test 2': () => new BettererTest({
    test: () => 0,
    constraint: bigger
  }),
  'test 3': () => new BettererTest({
    test: () => 0,
    constraint: bigger
  }),
  'test 4': () => regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
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

    expect(runNames(run.ran)).toEqual(['test 1', 'test 2', 'test 3', 'test 4']);
    expect(runNames(run.skipped)).toEqual([]);

    const onlyRun = await betterer({ configPaths: [resolve('./.betterer.only.ts')], resultsPath, workers: 1 });

    expect(runNames(onlyRun.ran)).toEqual(['test 1', 'test 4']);
    expect(runNames(onlyRun.skipped)).toEqual(['test 2', 'test 3']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
