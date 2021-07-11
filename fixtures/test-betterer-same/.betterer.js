const { BettererTest } = require('@betterer/betterer');
const { bigger, smaller } = require('@betterer/constraints');

let start = 0;

module.exports = {
  [`doesn't get bigger`]: () => new BettererTest({
    test: () => start,
    constraint: bigger
  }),
  [`doesn't get smaller`]: () => new BettererTest({
    test: () => start,
    constraint: smaller
  })
};