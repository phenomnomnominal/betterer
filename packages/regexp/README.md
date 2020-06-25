[![Betterer](https://raw.githubusercontent.com/phenomnomnominal/betterer/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/regexp`

[![npm version](https://img.shields.io/npm/v/@betterer/regexp.svg)](https://www.npmjs.com/package/@betterer/regexp)

RegExp test for [**`Betterer`**](https://github.com/phenomnomnominal/betterer).

## Description

Use this test to incrementally remove RegExp matches from your codebase!

## Usage

```typescript
import { regexp } from '@betterer/regexp';

export default {
  'no hack comments': regexp(/(\/\/\s*HACK)/i).include('**/*.ts')
};
```

### Skip

Skip a test by calling `.skip()`:

```typescript
import { regexp } from '@betterer/regexp';

export default {
  'no hack comments': regexp(...).skip()
};
```

### Only

Run a test by itself by calling `.only()`:

```typescript
import { regexp } from '@betterer/regexp';

export default {
  'no hack comments': regexp(...).only()
};
```

### Exclude

Exclude files from a test by calling `.exclude()`:

```typescript
import { regexp } from '@betterer/regexp';

export default {
  'no hack comments': regexp(...).exclude(/excluded-file-regexp/)
};
```
