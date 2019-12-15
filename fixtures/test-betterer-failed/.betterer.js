const { bigger } = require('@betterer/constraints/src');

module.exports = {
  'throws error': {
    test: () => {
      throw new Error();
    },
    constraint: bigger
  }
};
