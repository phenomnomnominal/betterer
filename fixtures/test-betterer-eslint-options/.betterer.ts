import { eslintBetterer } from '@betterer/eslint';

export default {
  'eslint enable complex rule': eslintBetterer('./src/**/*.ts', [
    'no-restricted-syntax',
    [
      'error',
      {
        selector: 'ExportDefaultDeclaration',
        message: 'Prefer named exports'
      }
    ]
  ])
};
