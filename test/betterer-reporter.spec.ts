import {
  betterer,
  BettererContext,
  BettererFilePaths,
  BettererRun,
  BettererRuns,
  BettererSummaries,
  BettererSummary
} from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer --reporter', () => {
  it('should work with an npm module', async () => {
    const { paths, cleanup } = await createFixture('test-betterer-reporter-npm', {
      '.betterer.js': ``
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const reporters = ['@betterer/reporter'];

    let throws = false;
    try {
      await betterer({ configPaths, resultsPath, reporters });
    } catch {
      throws = true;
    }

    expect(throws).toBe(false);

    await cleanup();
  });

  it('should work with a local module', async () => {
    const { paths, cleanup, resolve } = await createFixture('test-betterer-reporter-local', {
      'reporter.js': `
        module.exports.reporter = {};
      `,
      '.betterer.js': ``
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const reporters = [resolve('reporter.js')];

    let throws = false;
    try {
      await betterer({ configPaths, resultsPath, reporters });
    } catch {
      throws = true;
    }

    expect(throws).toBe(false);

    await cleanup();
  });

  it('should work with an inline reporter', async () => {
    const { paths, cleanup } = await createFixture('test-betterer-reporter-inline', {
      '.betterer.ts': `
import { bigger } from '@betterer/constraints';

let start = 0;

export const getsBetter = {
  test: () => start++,
  constraint: bigger
};      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const reporters = [
      {
        configError() {
          return;
        },
        contextStart() {
          return;
        },
        contextEnd() {
          return;
        },
        contextError() {
          return;
        },
        runsStart() {
          return;
        },
        runsEnd() {
          return;
        },
        runsError() {
          return;
        },
        runStart() {
          return;
        },
        runEnd() {
          return;
        },
        runError() {
          return;
        }
      }
    ];

    let throws = false;
    try {
      await betterer({ configPaths, resultsPath, reporters });
    } catch {
      throws = true;
    }

    expect(throws).toBe(false);

    await cleanup();
  });

  it('should work with a lifecycle based reporter', async () => {
    const { paths, cleanup } = await createFixture('test-betterer-reporter-lifecycle', {
      '.betterer.ts': `
import { bigger } from '@betterer/constraints';

let start = 0;

export const getsBetter = {
  test: () => start++,
  constraint: bigger
};      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const reporters = [
      {
        configError() {
          return;
        },
        async contextStart(_: BettererContext, lifecycle: Promise<BettererSummaries>) {
          try {
            await lifecycle;
          } catch (e) {
            return;
          }
        },
        async runsStart(_: BettererRuns, __: BettererFilePaths, lifecycle: Promise<BettererSummary>) {
          try {
            await lifecycle;
          } catch (e) {
            return;
          }
        },
        async runStart(_: BettererRun, lifecycle: Promise<void>) {
          try {
            await lifecycle;
          } catch (e) {
            return;
          }
        }
      }
    ];

    let throws = false;
    try {
      await betterer({ configPaths, resultsPath, reporters });
    } catch {
      throws = true;
    }

    expect(throws).toBe(false);

    await cleanup();
  });

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
