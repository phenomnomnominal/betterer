import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it(`doesn't break in debug mode`, async () => {
    const { logs, paths, cleanup } = await createFixture('test-betterer-debug', {
      '.betterer.js': `
const { smaller, bigger } = require('@betterer/constraints');

let grows = 0;
let shrinks = 2;

module.exports = {
  'should shrink': {
    test: () => shrinks--,
    constraint: smaller
  },
  'should grow': {
    test: () => grows++,
    constraint: bigger
  }
};
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    process.env.DEBUG = '1';
    process.env.DEBUG_TIME = '1';
    process.env.DEBUG_VALUES = '1';
    await betterer({ configPaths, resultsPath });

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
