const { smaller, bigger } = require('@betterer/constraints');

let grows = 0;

module.exports = {
  'should shrink': {
    test: () => grows++,
    constraint: smaller
  }
};
