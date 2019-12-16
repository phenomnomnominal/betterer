[![betterer](https://github.com/phenomnomnominal/betterer/blob/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/regexp`

[![npm version](https://img.shields.io/npm/v/@betterer/regexp.svg)](https://www.npmjs.com/package/@betterer/regexp)

RegExp betterer for [**`betterer`**](https://github.com/phenomnomnominal/betterer).

## Description

Use this betterer to incrementally remove RegExp matches from your codebase!

## Usage

```javascript
const { regexpBetterer } = require('@betterer/regexp');

module.exports = {
  'no hack comments': regexpBetterer('**/*.ts', /(\/\/\s*HACK)/i)
};
```
