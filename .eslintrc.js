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

const OVERRIDE_RULES = {
  ...BASE_RULES,
  'no-console': 2,
  '@typescript-eslint/unbound-method': 0,
  '@typescript-eslint/no-use-before-define': [2, { functions: false }],
  '@typescript-eslint/member-ordering': 2
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
      files: ['**/*.ts', '**/*.tsx'],
      extends: BASE_EXTENDS,
      rules: OVERRIDE_RULES
    },
    {
      files: ['test/**/*'],
      env: {
        jest: true
      },
      plugins: ['jest'],
      extends: [...BASE_EXTENDS, 'plugin:jest/recommended', 'plugin:jest/style'],
      rules: OVERRIDE_RULES
    },
    {
      files: ['docs/**/*'],
      env: {
        browser: true
      }
    }
  ]
};
