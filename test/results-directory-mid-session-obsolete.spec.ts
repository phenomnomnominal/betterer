import { describe, expect, it } from 'vitest';

import { existsSync } from 'node:fs';
import path from 'node:path';

import { createFixture } from './fixture.js';

const CONFIG_BOTH = `
import { regexp } from '@betterer/regexp';

export default {
  'a': () => regexp(/(\\/\\/\\s*AAA)/g).include('./src/**/*.ts'),
  'b': () => regexp(/(\\/\\/\\s*BBB)/g).include('./src/**/*.ts')
};
`;

const CONFIG_A = `
import { regexp } from '@betterer/regexp';

export default {
  'a': () => regexp(/(\\/\\/\\s*AAA)/g).include('./src/**/*.ts')
};
`;

describe('betterer', () => {
  it('should drop a test added and then removed within one runner session, not report it as obsolete', async () => {
    const { runner } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile } = await createFixture('results-directory-mid-session-obsolete', {
      '.betterer.ts': CONFIG_BOTH
    });

    const configPaths = [paths.config];
    const resultsDir = `${paths.results}.d`;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), `// AAA\n// BBB`);

    // `b` added, then removed, within one session:
    const bettererRunner = await runner({ configPaths, resultsStrategy: 'directory', resultsDir, workers: false });
    await bettererRunner.queue([]);
    await writeFile(paths.config, CONFIG_A);
    await bettererRunner.queue([paths.config]);
    const summary = await bettererRunner.stop();

    const obsolete = summary?.lastSuite.runs.filter((run) => run.isObsolete).map((run) => run.name);
    expect(obsolete).toEqual([]);
    expect(existsSync(path.join(resultsDir, 'b'))).toBe(false);

    await cleanup();
  });
});
