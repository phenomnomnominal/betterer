---
id: eslint-test
title: ESLint test
slug: /eslint-test
---

**Betterer** ships several built-in tests to get you started. Check out the [implementations](https://github.com/phenomnomnominal/betterer/blob/master/packages/eslint/src/eslint.ts) for inspiration for your own tests!

### [`@betterer/eslint`](https://www.npmjs.com/package/@betterer/eslint)

Use this test to incrementally introduce new [**ESLint**](https://eslint.org/) rules to your codebase. You can pass as many [rule configurations](https://eslint.org/docs/rules/) as you like:

```typescript
import { eslint } from '@betterer/eslint';

export default {
  'no more debuggers': () => eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')
};
```

[`@betterer/eslint`](https://www.npmjs.com/package/@betterer/eslint) is a [BettererFileTest](./betterer.bettererfiletest), so you can use [`include`](./betterer.bettererresolvertest.include), [`exclude`](./betterer.bettererresolvertest.exclude), [`only`](betterer.bettererresolvertest.only), and [`skip`](betterer.bettererresolvertest.skip).
