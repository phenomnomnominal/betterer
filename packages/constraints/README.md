[![Betterer](https://raw.githubusercontent.com/phenomnomnominal/betterer/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/constraints`

[![npm version](https://img.shields.io/npm/v/@betterer/constraints.svg)](https://www.npmjs.com/package/@betterer/constraints)

Simple constraint functions for use with [**`Betterer`**](https://github.com/phenomnomnominal/betterer).

## Usage

### Bigger

```typescript
import { bigger } from '@betterer/constraints';

bigger(1, 2); // worse;
bigger(1, 1); // worse;
bigger(2, 1); // better;
bigger(2, 2); // same;
```

### Smaller

```typescript
import { smaller } from '@betterer/constraints';

smaller(2, 1); // worse;
smaller(1, 1); // worse;
smaller(1, 2); // better;
smaller(2, 2); // same;
```
