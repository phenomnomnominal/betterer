const { bigger } = require('./dist');

module.exports = {
    'check that some number got bigger': [
        () => Date.now(),
        bigger
    ]
};
