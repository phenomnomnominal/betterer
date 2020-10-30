[![Betterer](https://raw.githubusercontent.com/phenomnomnominal/betterer/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/errors`

[![npm version](https://img.shields.io/npm/v/@betterer/errors.svg)](https://www.npmjs.com/package/@betterer/errors)

Error handler used within [**`Betterer`**](https://github.com/phenomnomnominal/betterer).

## Usage

### BettererError

Create an error:

```typescript
import { BettererError } from '@betterer/errors';

const error = new BettererError(`Something went wrong: "OOPS!"`, { some: 'details' });
```

### Log Error

> ## 🚨🚨🚨 THIS FUNCTION SHOULD ONLY BE USED WITHIN THE BETTERER MONOREPO 🚨🚨🚨

Log a registered error type:

```typescript
import { BettererError, logErrorΔ } from '@betterer/errors';

try {
    throw new BettererError(`Something went wrong: "OOPS!"`):
} catch (e) {
    logErrorΔ(e); // 'Something went wrong: "OOPS"'
}
```
