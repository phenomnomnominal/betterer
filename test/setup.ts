import '@betterer/fixture';
import { jest } from '@jest/globals';

jest.setTimeout(300000);

type BettererUtils = typeof import('../packages/betterer/dist/utils.js');
jest.mock('../packages/betterer/dist/utils.js', (): BettererUtils => {
  const original = jest.requireActual('../packages/betterer/dist/utils.js') as BettererUtils;

  return {
    ...original,
    getTime: () => 0
  };
});

type BettererTasksUtils = typeof import('../packages/tasks/dist/utils.js');
jest.mock('../packages/tasks/dist/utils.js', (): BettererTasksUtils => {
  return {
    getTime: () => 0,
    getPreciseTime: () => 0
  };
});
