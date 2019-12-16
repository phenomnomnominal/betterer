[![betterer](https://github.com/phenomnomnominal/betterer/blob/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/eslint`

[![npm version](https://img.shields.io/npm/v/@betterer/eslint.svg)](https://www.npmjs.com/package/@betterer/eslint)

ESLint betterer for [**`betterer`**](https://github.com/phenomnomnominal/betterer).

## Description

Use this betterer to incrementally introduce ESLint rules to your codebase

## Usage

```javascript
const { eslintBetterer } = require('@betterer/eslint');

module.exports = {
  'no more debuggers': eslintBetterer('./src/**/*.ts', ['no-debugger', 'error'])
};
```
