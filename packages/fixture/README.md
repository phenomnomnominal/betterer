[![Betterer](https://raw.githubusercontent.com/phenomnomnominal/betterer/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/fixture`

Fixture tools used within [**`Betterer`**](https://github.com/phenomnomnominal/betterer).

## Usage

> ## 🚨🚨🚨 THIS PACKAGE SHOULD ONLY BE USED WITHIN THE BETTERER MONOREPO 🚨🚨🚨

### Code

```typescript
import { createFixtureΔ } from '@betterer/fixture';

createFixtureΔ('fixture-name', {
  'index.ts': `
// File contents.
  `,
  'package.json': `
{
  "name": "@betterer/fixture",
}
  `
});
```
