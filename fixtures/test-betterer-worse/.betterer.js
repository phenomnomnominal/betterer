const { smaller } = require('@betterer/constraints');

let start = 0;

module.exports = {
  'gets worse': {
    test: () => start++,
    constraint: smaller
  }
};
