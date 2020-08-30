import { betterer } from '@betterer/betterer';
import { createFixtureΔ } from '@betterer/fixture';

describe('betterer', () => {
  it('should throw if there is no constraint', async () => {
    const { paths, logs, cleanup } = await createFixtureΔ('test-betterer-custom-no-constraint', {
      '.betterer.js': `
module.exports = {
  'custom test no constraint': {}
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
    const { paths, logs, cleanup } = await createFixtureΔ('test-betterer-custom-no-test', {
      '.betterer.js': `
  const { smaller } = require('@betterer/constraints');

  module.exports = {
    'custom test no test': {
      constraint: smaller
    }
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
