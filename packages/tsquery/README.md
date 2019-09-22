# `@betterer/tsquery`

[![npm version](https://img.shields.io/npm/v/@betterer/tsquery.svg)](https://www.npmjs.com/package/@betterer/tsquery)

TSQuery betterer for [**`betterer`**](https://github.com/phenomnomnominal/betterer).

## Description

Use this betterer to incrementally remove TSQuery matches from your codebase!

## Usage

```javascript
const { tsqueryBetterer } = require('@betterer/tsquery');

module.exports = {
  'no raw console.log': tsqueryBetterer(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
};
```
