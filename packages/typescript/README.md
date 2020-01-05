[![betterer](https://github.com/phenomnomnominal/betterer/blob/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/typescript`

[![npm version](https://img.shields.io/npm/v/@betterer/typescript.svg)](https://www.npmjs.com/package/@betterer/typescript)

TypeScript betterer for [**`betterer`**](https://github.com/phenomnomnominal/betterer).

## Description

Use this betterer to incrementally introduce TypeScript configuration to your codebase!

## Usage

```typescript
import { typescriptBetterer } from '@betterer/typescript';

export default {
  'stricter compilation': typescriptBetterer('./tsconfig.json', {
    strict: true
  })
};
```

### Skip

Skip a test by calling `.skip()`:

```typescript
import { typescriptBetterer } from '@betterer/typescript';

export default {
  'stricter compilation': typescriptBetterer(...).skip()
};
```

### Only

Run a test by itself by calling `.only()`:

```typescript
import { typescriptBetterer } from '@betterer/typescript';

export default {
  'stricter compilation': typescriptBetterer(...).only()
};
```

### Exclude

Exclude files from a test by calling `.exclude()`:

```typescript
import { typescriptBetterer } from '@betterer/typescript';

export default {
  'stricter compilation': typescriptBetterer(...).exclude(/excluded-file-regexp/)
};
```
