---
id: constraints
title: Betterer contraints
sidebar_label: Betterer contraints
slug: /constraints
---

## `BettererConstraintResult`

```typescript
enum BettererConstraintResult {
  better = 'better',
  same = 'same',
  worse = 'worse'
}
```

## `bigger()`

Check if one value is bigger than another:

Usage:

```typescript
import { bigger } from '@betterer/constraints';

bigger(1, 2); // worse
bigger(1, 1); // worse
bigger(2, 1); // better
bigger(2, 2); // same
```

Args:

- `result`: `number` - the current value
- `expected`: `number` - the expected value

Returns: [`BettererConstraintResult`](#bettererconstraintresult)

## `smaller()`

Check if one value is smaller than another:

Usage:

```typescript
import { smaller } from '@betterer/constraints';

smaller(2, 1); // worse
smaller(1, 1); // worse
smaller(1, 2); // better
smaller(2, 2); // same
```

Args:

- `result`: `number` - the current value
- `expected`: `number` - the expected value

Returns: [`BettererConstraintResult`](#bettererconstraintresult)
