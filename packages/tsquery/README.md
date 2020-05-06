[![betterer](https://github.com/phenomnomnominal/betterer/blob/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/tsquery`

[![npm version](https://img.shields.io/npm/v/@betterer/tsquery.svg)](https://www.npmjs.com/package/@betterer/tsquery)

[**TSQuery**](https://github.com/phenomnomnominal/tsquery) betterer for [**`betterer`**](https://github.com/phenomnomnominal/betterer).

## Description

Use this betterer to incrementally remove TSQuery matches from your codebase! See the [TSQuery doecumentation](https://github.com/phenomnomnominal/tsquery) for more details about the query syntax.

## Usage

```typescript
import { tsqueryBetterer } from '@betterer/tsquery';

export default {
  'no raw console.log': tsqueryBetterer(
    './tsconfig.json',
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  )
};
```

### Skip

Skip a test by calling `.skip()`:

```typescript
import { tsqueryBetterer } from '@betterer/tsquery';

export default {
  'no raw console.log': tsqueryBetterer(...).skip()
};
```

### Only

Run a test by itself by calling `.only()`:

```typescript
import { tsqueryBetterer } from '@betterer/tsquery';

export default {
  'no raw console.log': tsqueryBetterer(...).only()
};
```

### Exclude

Exclude files from a test by calling `.exclude()`:

```typescript
import { tsqueryBetterer } from '@betterer/tsquery';

export default {
  'no raw console.log': tsqueryBetterer(...).exclude(/excluded-file-regexp/)
};
```
