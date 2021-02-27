import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer --silent', () => {
  it('should silence all console output', async () => {
    const { logs, paths, cleanup } = await createFixture('test-betterer-silent', {
      '.betterer.js': `
const { smaller } = require('@betterer/constraints');

let shrinks = 2;
    
module.exports = {
  'should shrink': {
    test: () => shrinks--,
    constraint: smaller
  }
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await betterer({ configPaths, resultsPath, silent: true });

    expect(logs).toHaveLength(0);
    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should be possible to unsilence a subsequent run', async () => {
    const { logs, paths, cleanup } = await createFixture('test-betterer-silent-then-not-silent', {
      '.betterer.js': `
const { smaller } = require('@betterer/constraints');

let shrinks = 2;

module.exports = {
  'should shrink': {
    test: () => shrinks--,
    constraint: smaller
  }
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await betterer({ configPaths, resultsPath, silent: true });

    expect(logs).toHaveLength(0);

    await betterer({ configPaths, resultsPath });

    expect(logs).not.toHaveLength(0);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
