const { bigger, smaller } = require('@betterer/constraints');

let start = 0;

module.exports = {
  [`doesn't get bigger`]: {
    test: () => start,
    constraint: bigger
  },
  [`doesn't get smaller`]: {
    test: () => start,
    constraint: smaller
  }
};
