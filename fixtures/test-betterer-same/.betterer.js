const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports = {
  'stays the same': {
    test: () => start,
    constraint: bigger
  }
};
