const { eslintBetterer } = require('./dist');

module.exports = {
  'eslint enable new rule': eslintBetterer('./src/**/*.ts', [
    'no-debugger',
    'error'
  ])
  // 'tsc enable new option': tscBetterer(
  //   path.join(__dirname, './tsconfig.json'),
  //   {
  //     noImplicitAny: true
  //   }
  // )
};
