[![Betterer](https://raw.githubusercontent.com/phenomnomnominal/betterer/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/eslint`

[![npm version](https://img.shields.io/npm/v/@betterer/eslint.svg)](https://www.npmjs.com/package/@betterer/eslint)

ESLint test for [**`Betterer`**](https://github.com/phenomnomnominal/betterer).

## Description

Use this test to incrementally introduce ESLint rules to your codebase

## Usage

```typescript
import { eslintBetterer } from '@betterer/eslint';

export default {
  'no more debuggers': eslintBetterer('./src/**/*.ts', ['no-debugger', 'error'])
};
```

### Skip

Skip a test by calling `.skip()`:

```typescript
import { eslintBetterer } from '@betterer/eslint';

export default {
  'no more debuggers': eslintBetterer(...).skip()
};
```

### Only

Run a test by itself by calling `.only()`:

```typescript
import { regexpBetterer } from '@betterer/regexp';

export default {
  'no more debuggers': eslintBetterer(...).only()
};
```

### Exclude

Exclude files from a test by calling `.exclude()`:

```typescript
import { regexpBetterer } from '@betterer/regexp';

export default {
  'no more debuggers': eslintBetterer(...).exclude(/excluded-file-regexp/)
};
```
