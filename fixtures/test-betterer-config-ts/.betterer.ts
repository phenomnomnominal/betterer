const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports = {
  'gets better': {
    test: () => start++,
    constraint: bigger
  }
};
