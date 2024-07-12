const path = require('node:path');

const BASE_EXTENDS = [
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:@typescript-eslint/recommended-requiring-type-checking',
  'plugin:prettier/recommended',
  'plugin:import/recommended',
  'plugin:import/typescript',
  'plugin:eslint-comments/recommended',
  'plugin:require-extensions/recommended'
];

const BASE_RULES = {
  'eol-last': ['error', 'always'],
  '@typescript-eslint/return-await': ['error', 'always'],
  '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
  '@typescript-eslint/member-ordering': 'error',
  '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', disallowTypeAnnotations: false }],
  'eslint-comments/require-description': ['error', { ignore: ['eslint-enable'] }],
  'import/no-unresolved': 'off'
};

const OVERRIDE_RULES = {
  ...BASE_RULES,
  'no-console': 'error',
  '@typescript-eslint/unbound-method': 'off'
};

module.exports = {
  env: {
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    project: path.resolve(__dirname, './tsconfig.eslint.json'),
    sourceType: 'module',
    extraFileExtensions: ['.cjs']
  },
  plugins: ['@typescript-eslint', 'require-extensions'],
  rules: {
    ...BASE_RULES
  },
  overrides: [
    { files: ['fixtures/**/*'], rules: {} },
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: BASE_EXTENDS,
      rules: OVERRIDE_RULES
    },
    {
      files: ['test/**/*'],
      extends: [...BASE_EXTENDS],
      rules: OVERRIDE_RULES
    },
    {
      files: ['docs/**/*'],
      env: {
        browser: true
      }
    }
  ],
  settings: {
    'import/resolver': {
      typescript: true
    }
  }
};
