# `@betterer/typescript`

[![npm version](https://img.shields.io/npm/v/@betterer/typescript.svg)](https://www.npmjs.com/package/@betterer/typescript)

TypeScript betterer for [**`betterer`**](https://github.com/phenomnomnominal/betterer).

## Description

Use this betterer to incrementally introduce TypeScript configuration to your codebase!

## Usage

```javascript
const { typescriptBetterer } = require('@betterer/typescript');

module.exports = {
  'stricter compilation': typescriptBetterer('./tsconfig.json', {
    useStrict: true
  })
};
```
