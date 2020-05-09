const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports = {
  'gets completed': {
    test: () => start++,
    constraint: bigger,
    goal: (result) => result >= 2
  },
  'already completed': {
    test: () => 0,
    constraint: bigger,
    goal: 0
  }
};
