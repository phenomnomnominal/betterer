import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer --reporter', () => {
  it('should throw when there is nothing exported', async () => {
    const { logs, paths, cleanup, resolve } = await createFixture('test-betterer-reporter-nothing', {
      'reporter.js': ``
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const reporters = [resolve('reporter.js')];

    await expect(async () => await betterer({ configPaths, resultsPath, reporters })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should throw when there is an invalid hook', async () => {
    const { logs, paths, cleanup, resolve } = await createFixture('test-betterer-reporter-invalid-hook', {
      'reporter.js': `
module.exports.reporter = {
    notAHook: ''
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const reporters = [resolve('reporter.js')];

    await expect(async () => await betterer({ configPaths, resultsPath, reporters })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should throw when a hook is not a function', async () => {
    const { logs, paths, cleanup, resolve } = await createFixture('test-betterer-reporter-hook-not-a-function', {
      'reporter.js': `
module.exports.reporter = {
    contextStart: ''
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const reporters = [resolve('reporter.js')];

    await expect(async () => await betterer({ configPaths, resultsPath, reporters })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
