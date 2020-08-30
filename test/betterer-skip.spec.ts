import { betterer } from '@betterer/betterer';
import { createFixtureΔ } from '@betterer/fixture';

describe('betterer', () => {
  it('should skip a test', async () => {
    const { logs, paths, readFile, cleanup, resolve, writeFile, runNames } = await createFixtureΔ(
      'test-betterer-skip',
      {
        '.betterer.skip.ts': `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
import { regexp } from '@betterer/regexp';

let start = 0;

export default {
  'test 1': new BettererTest({
    test: () => start++,
    constraint: bigger
  }).skip(),
  'test 2': regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts').skip()
};
      `,
        '.betterer.ts': `
import { bigger } from '@betterer/constraints';
import { regexp } from '@betterer/regexp';

let start = 0;

export default {
  'test 1': {
    test: () => start++,
    constraint: bigger
  },
  'test 2': regexp(/(\\/\\/\\s*HACK)/i).include('./src/**/*.ts')
};
      `
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const indexPath = resolve('./src/index.ts');

    await writeFile(indexPath, `// HACK:`);

    const run = await betterer({ configPaths, resultsPath });

    expect(runNames(run.ran)).toEqual(['test 1', 'test 2']);
    expect(runNames(run.skipped)).toEqual([]);

    const skipRun = await betterer({
      configPaths: [resolve('./.betterer.skip.ts')],
      resultsPath
    });

    expect(runNames(skipRun.ran)).toEqual([]);
    expect(runNames(skipRun.skipped)).toEqual(['test 1', 'test 2']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
