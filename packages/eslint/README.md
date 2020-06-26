[![Betterer](https://raw.githubusercontent.com/phenomnomnominal/betterer/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/eslint`

[![npm version](https://img.shields.io/npm/v/@betterer/eslint.svg)](https://www.npmjs.com/package/@betterer/eslint)

ESLint test for [**`Betterer`**](https://github.com/phenomnomnominal/betterer).

## Description

Use this test to incrementally introduce ESLint rules to your codebase

## Usage

```typescript
import { eslint } from '@betterer/eslint';

export default {
  'no more debuggers': eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
};
```

### Skip

Skip a test by calling `.skip()`:

```typescript
import { eslint } from '@betterer/eslint';

export default {
  'no more debuggers': eslint(...).skip()
};
```

### Only

Run a test by itself by calling `.only()`:

```typescript
import { eslint } from '@betterer/eslint';

export default {
  'no more debuggers': eslint(...).only()
};
```

### Exclude

Exclude files from a test by calling `.exclude()`:

```typescript
import { eslint } from '@betterer/eslint';

export default {
  'no more debuggers': eslint(...).exclude(/excluded-file-regexp/)
};
```
