const { smaller } = require('@betterer/constraints/src');

let start = 0;

module.exports = {
  'gets worse': {
    test: () => start++,
    constraint: smaller
  }
};
