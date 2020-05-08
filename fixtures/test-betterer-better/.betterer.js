const { smaller, bigger } = require('@betterer/constraints');

let grows = 0;
let shrinks = 2;

module.exports = {
  'should shrink': {
    test: () => shrinks--,
    constraint: smaller
  },
  'should grow': {
    test: () => grows++,
    constraint: bigger
  }
};
