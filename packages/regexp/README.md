[![betterer](https://github.com/phenomnomnominal/betterer/blob/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/regexp`

[![npm version](https://img.shields.io/npm/v/@betterer/regexp.svg)](https://www.npmjs.com/package/@betterer/regexp)

RegExp betterer for [**`betterer`**](https://github.com/phenomnomnominal/betterer).

## Description

Use this betterer to incrementally remove RegExp matches from your codebase!

## Usage

```typescript
import { regexpBetterer } from '@betterer/regexp';

export default {
  'no hack comments': regexpBetterer('**/*.ts', /(\/\/\s*HACK)/i)
};
```

### Skip

Skip a test by calling `.skip()`:

```typescript
import { regexpBetterer } from '@betterer/regexp';

export default {
  'no hack comments': regexpBetterer(...).skip()
};
```

### Only

Run a test by itself by calling `.only()`:

```typescript
import { regexpBetterer } from '@betterer/regexp';

export default {
  'no hack comments': regexpBetterer(...).only()
};
```

### Exclude

Exclude files from a test by calling `.exclude()`:

```typescript
import { regexpBetterer } from '@betterer/regexp';

export default {
  'no hack comments': regexpBetterer(...).exclude(/excluded-file-regexp/)
};
```
