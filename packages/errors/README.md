[![Betterer](https://raw.githubusercontent.com/phenomnomnominal/betterer/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/errors`

[![npm version](https://img.shields.io/npm/v/@betterer/errors.svg)](https://www.npmjs.com/package/@betterer/errors)

Error type used within [**`Betterer`**](https://github.com/phenomnomnominal/betterer).

## Usage

### BettererError

Create an error:

```typescript
import { BettererError } from '@betterer/errors';

const error = new BettererError(`Something went wrong: "OOPS!"`, { some: 'details' });
```
