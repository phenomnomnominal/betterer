---
id: introduction
title: Introduction
sidebar_label: Introduction
slug: /introduction
---

## What is **Betterer**?

Making widespread changes to a codebase can be really hard! When trying to make a radical improvement to a lot of code, one of two things often happens:

1. You start a really long-lived branch that is difficult to maintain and often impossible to merge.
2. You and your team have some agreement to make the improvement slowly over time, but it is forgotten about and never really happens.

**Betterer** is designed to solve this problem! **Betterer** will help you make _incremental_ improvements to your codebase, and stop you from moving further away from your goals.

## How does **Betterer** work?

**Betterer** is built upon an idea popularised by snapshot testing, where the result of a test is saved in a file in your codebase. However, instead of a static value, **Betterer** keeps track of a value as it changes over time, and makes sure that the value changes how you want it to change!

When you want to make an improvement to your codebase, start by making a new test, defined in a `.betterer.ts` file:

```typescript
// .betterer.ts
import { smaller } from '@betterer/constraints';

export default {
  'thing you want to improve': {
    test: () => runMyTest(),
    constraint: smaller,
    goal: 0
  }
};
```

When you run **Betterer** for the first time it will store the result of your tests in a `.betterer.results` file:

```javascript
// BETTERER RESULTS V2.
exports[`thing you want to improve`] = {
  value: `12345
`
};
```

Whenever your tests run again, **Betterer** will compare the new result against the expected result.

If it gets better, the `.betterer.results` file will be updated with the new result ✅! If it gets worse, your test will fail and **Betterer** will throw an error ❌!
