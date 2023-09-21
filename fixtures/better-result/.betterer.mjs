import { BettererTest } from '@betterer/betterer';
import { smaller, bigger } from '@betterer/constraints';
import { persist } from '@betterer/fixture';

const grows = persist(__dirname, 'grows', 0);
const shrinks = persist(__dirname, 'shrinks', 2);

export default {
  'should shrink': () => new BettererTest({
    test: () => shrinks.decrement(),
    constraint: smaller
  }),
  'should grow': () => new BettererTest({
    test: () => grows.increment(),
    constraint: bigger
  })
};