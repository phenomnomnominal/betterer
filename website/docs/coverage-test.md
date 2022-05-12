---
id: coverage-test
title: Coverage test
slug: /coverage-test
---

**Betterer** ships several built-in tests to get you started. Check out the [implementations](https://github.com/phenomnomnominal/betterer/blob/master/packages/coverage/src/coverage.ts) for inspiration for your own tests!

### [`@betterer/coverage`](https://www.npmjs.com/package/@betterer/coverage)

Use the `coverage` test to incrementally increase the per-file test coverage of your project.

[`@betterer/coverage`](https://www.npmjs.com/package/@betterer/coverage) expects an [Istanbul](https://istanbul.js.org/) [json-summary](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib/json-summary) to exist, so you must run your tests first.

```typescript
import { coverage } from '@betterer/coverage';

export default {
  'increase per-file test coverage': () => coverage()
};
```

Use the `coverageTotal` test to incrementally increase the total test coverage of your project.

```javascript
import { coverage } from '@betterer/coverage';

export default {
  'increase total test coverage': () => coverageTotal()
};
```
