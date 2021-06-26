---
id: built-in-tests
title: Built-in Tests
slug: /built-in-tests
---

**Betterer** ships several built-in tests to get you started. Check out the [implementations](https://github.com/phenomnomnominal/betterer/blob/master/packages/eslint/src/eslint.ts) for some more [inspiration](https://github.com/phenomnomnominal/betterer/blob/master/packages/typescript/src/typescript.ts) for your own tests!

### [`@betterer/eslint`](https://www.npmjs.com/package/@betterer/eslint)

Use this test to incrementally introduce new [**ESLint**](https://eslint.org/) rules to your codebase. You can pass as many **ESLint** [rule configurations](https://eslint.org/docs/rules/) as you like:

```typescript
import { eslint } from '@betterer/eslint';

export default {
  'no more debuggers': eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
};
```

`@betterer/eslint` is a [BettererFileTest](./betterer-file-test), so you can use [`include`](./betterer-file-test#include), [`exclude`](./betterer-file-test#exclude), [`only`](betterer-test#only), and [`skip`](betterer-test#skip).

### [`@betterer/regexp`](https://www.npmjs.com/package/@betterer/regexp)

Use this test to incrementally remove [**RegExp**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) matches from your codebase.

```typescript
import { regexp } from '@betterer/regexp';

export default {
  'no hack comments': regexp(/(\/\/\s*HACK)/i).include('**/*.ts')
};
```

`@betterer/regexp` is a [BettererFileTest](./betterer-file-test), so you can use [`include`](./betterer-file-test#include), [`exclude`](./betterer-file-test#exclude), [`only`](betterer-test#only), and [`skip`](betterer-test#skip).

### [`@betterer/stylelint`](https://www.npmjs.com/package/@betterer/stylelint)

Use this test to incrementally introduce new [**Stylelint**](https://stylelint.io/) rules to your codebase.

```typescript
import { stylelint } from '@betterer/stylelint';

export default {
  'no unknown units': stylelint({
    rules: {
      'unit-no-unknown': true
    }
  }).include('**/*.css)
};
```

### [`@betterer/tsquery`](https://www.npmjs.com/package/@betterer/tsquery)

Use this test to incrementally remove **TSQuery** matches from your codebase. See the [**TSQuery** documentation](https://github.com/phenomnomnominal/tsquery) for more details about the query syntax.

```typescript
import { tsquery } from '@betterer/tsquery';

export default {
  'no raw console.log':
    'CallExpression > PropertyAccessExpression[expression.name="console"][name.name="log"]'
  ).include('./src/**/*.ts')
};
```

`@betterer/tsquery` is a [BettererFileTest](./betterer-file-test), so you can use [`include`](./betterer-file-test#include), [`exclude`](./betterer-file-test#exclude), [`only`](betterer-test#only), and [`skip`](betterer-test#skip).

### [`@betterer/typescript`](https://www.npmjs.com/package/@betterer/typescript)

Use this test to incrementally introduce [**TypeScript** configuration](https://www.typescriptlang.org/docs/handbook/compiler-options.html) to your codebase.

```typescript
import { typescript } from '@betterer/typescript';

export default {
  'stricter compilation': typescript('./tsconfig.json', {
    strict: true
  }).include('./src/**/*.ts')
};
```

`@betterer/typescript` is a [BettererFileTest](./betterer-file-test), so you can use [`include`](./betterer-file-test#include), [`exclude`](./betterer-file-test#exclude), [`only`](betterer-test#only), and [`skip`](betterer-test#skip).
