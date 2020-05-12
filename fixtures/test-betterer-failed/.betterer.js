const { bigger } = require('@betterer/constraints');

module.exports = {
  'throws error': {
    test: () => {
      throw new Error('OH NO!');
    },
    constraint: bigger
  }
};
