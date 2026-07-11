import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer', () => {
  it('should reject test names that are not unique case-insensitively', async () => {
    const { betterer } = await import('@betterer/betterer');

    const { paths, cleanup, resolve, writeFile } = await createFixture('case-insensitive-test-name', {
      '.betterer.js': `
import { regexp } from '@betterer/regexp';

export default {
  'foo': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts'),
  'Foo': () => regexp(/(\\/\\/\\s*HACK)/g).include('./src/**/*.ts')
};
    `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    process.env.BETTERER_WORKER = 'false';

    await writeFile(resolve('./src/index.ts'), `// HACK`);

    try {
      await betterer({ configPaths, resultsPath, workers: false });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toContain('case-insensitively');
    }

    await cleanup();
  });
});
