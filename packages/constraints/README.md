# `@betterer/constraints`

[![npm version](https://img.shields.io/npm/v/@betterer/constraints.svg)](https://www.npmjs.com/package/@betterer/constraints)

Simple constraint functions for use with [**`betterer`**](https://github.com/phenomnomnominal/betterer).

## Usage

```typescript
import { bigger, smaller } from '@betterer/constraints';

bigger(1, 2); // false;
bigger(1, 1); // false;
bigger(2, 1); // true;

smaller(2, 1); // false;
smaller(1, 1); // false;
smaller(1, 2); // true;
```
