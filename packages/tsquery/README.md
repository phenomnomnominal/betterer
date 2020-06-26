[![Betterer](https://raw.githubusercontent.com/phenomnomnominal/betterer/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/tsquery`

[![npm version](https://img.shields.io/npm/v/@betterer/tsquery.svg)](https://www.npmjs.com/package/@betterer/tsquery)

[**TSQuery**](https://github.com/phenomnomnominal/tsquery) test for [**`Betterer`**](https://github.com/phenomnomnominal/betterer).

## Description

Use this test to incrementally remove TSQuery matches from your codebase! See the [TSQuery doecumentation](https://github.com/phenomnomnominal/tsquery) for more details about the query syntax.

## Usage

```typescript
import { tsquery } from '@betterer/tsquery';

export default {
  'no raw console.log': tsquery(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
};
```

### Skip

Skip a test by calling `.skip()`:

```typescript
import { tsquery } from '@betterer/tsquery';

export default {
  'no raw console.log': tsquery(...).skip()
};
```

### Only

Run a test by itself by calling `.only()`:

```typescript
import { tsquery } from '@betterer/tsquery';

export default {
  'no raw console.log': tsquery(...).only()
};
```

### Exclude

Exclude files from a test by calling `.exclude()`:

```typescript
import { tsquery } from '@betterer/tsquery';

export default {
  'no raw console.log': tsquery(...).exclude(/excluded-file-regexp/)
};
```
