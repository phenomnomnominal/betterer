const { bigger } = require('@betterer/constraints/src');

let start = 0;

module.exports = {
  'gets better': {
    test: () => start++,
    constraint: bigger,
  },
};
