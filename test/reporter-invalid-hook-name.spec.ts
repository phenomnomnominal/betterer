import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

describe('betterer --reporter', () => {
  it('should throw when there is an invalid hook name', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { logs, paths, cleanup, resolve } = await createFixture('reporter-invalid-hook-name', {
      'reporter.js': `
module.exports.reporter = {
    notAHook: ''
};
      `,
      '.betterer.js': ''
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const reporters = [resolve('reporter.js')];

    await expect(async () => {
      await betterer({ configPaths, resultsPath, reporters, workers: false });
    }).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
