import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should throw if it is not a function', async () => {
    const { paths, logs, cleanup } = await createFixture('test-betterer-custom-not-a-function', {
      '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');
const { smaller } = require('@betterer/constraints');
const { persist } = require('@betterer/fixture');

const shrinks = persist(__dirname, 'shrinks', 2);

module.exports = {
  'not a function': new BettererTest({
    test: () => shrinks.decrement(),
    constraint: smaller
  })
}
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it(`should throw if it doesn't return a BettererTest`, async () => {
    const { paths, logs, cleanup } = await createFixture('test-betterer-custom-not-a-betterertest', {
      '.betterer.js': `

module.exports = {
  'not a BettererTest': () => {}
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should throw if there is no constraint', async () => {
    const { paths, logs, cleanup } = await createFixture('test-betterer-custom-no-constraint', {
      '.betterer.js': `
const { BettererTest } = require('@betterer/betterer');

module.exports = {
  'custom test no constraint': () => new BettererTest({})
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should throw if there is no test', async () => {
    const { paths, logs, cleanup } = await createFixture('test-betterer-custom-no-test', {
      '.betterer.js': `
  const { BettererTest } = require('@betterer/betterer');
  const { smaller } = require('@betterer/constraints');

  module.exports = {
    'custom test no test': () => new BettererTest({
      constraint: smaller
    })
  };      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
