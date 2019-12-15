const { bigger } = require('@betterer/constraints/src');

let start = 0;

module.exports = {
  'stays the same': {
    test: () => start,
    constraint: bigger
  }
};
