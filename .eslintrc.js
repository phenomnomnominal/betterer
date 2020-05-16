const path = require('path');

const BASE_EXTENDS = [
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:@typescript-eslint/recommended-requiring-type-checking',
  'prettier/@typescript-eslint',
  'plugin:prettier/recommended'
];

const BASE_RULES = {
  'eol-last': [2, 'always']
};

module.exports = {
  env: {
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: path.resolve(__dirname, './tsconfig.eslint.json'),
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    ...BASE_RULES
  },
  overrides: [
    {
      files: ['**/*.ts'],
      extends: BASE_EXTENDS,
      rules: {
        ...BASE_RULES,
        '@typescript-eslint/unbound-method': 0,
        '@typescript-eslint/no-use-before-define': [2, { functions: false }],
        '@typescript-eslint/member-ordering': 2
      }
    },
    {
      files: ['test/**/*'],
      env: {
        jest: true
      },
      plugins: ['jest'],
      extends: [...BASE_EXTENDS, 'plugin:jest/recommended', 'plugin:jest/style']
    },
    {
      files: ['docs/**/*'],
      env: {
        browser: true
      }
    }
  ]
};
