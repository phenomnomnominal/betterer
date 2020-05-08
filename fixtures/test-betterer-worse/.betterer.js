const { smaller, bigger } = require('@betterer/constraints');

let grows = 0;
let shrinks = 2;

module.exports = {
  'should shrink': {
    test: () => grows++,
    constraint: smaller
  },
  'should grow': {
    test: () => shrinks--,
    constraint: bigger
  }
};
