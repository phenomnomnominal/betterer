const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports = {
  'gets completed': {
    test: () => start++,
    constraint: bigger,
    goal: 2
  }
};
