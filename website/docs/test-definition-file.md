---
id: test-definition-file
title: Test definition file
sidebar_label: Test definition file
slug: /test-definition-file
---

All your tests should be exported from a test definition file. By default, **Betterer** expects this to be `.betterer.ts` or `.betterer.js`, but you can change that by using the [`--config`](./running-betterer#start-options) flag when running **Betterer**.

## Default export

You can expose properties on the default export:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<!-- prettier-ignore -->
<Tabs
  groupId="language"
  defaultValue="ts"
  values={[
    { label: 'TypeScript', value: 'ts', },
    { label: 'JavaScript', value: 'js', },
  ]
}>
<TabItem value="ts">

```typescript
// .betterer.ts
export default {
  'my test': {
    // ... test config
  },
  'my other test': {
    // ... test config
  }
};
```

</TabItem>
<TabItem value="js">

```javascript
// .betterer.js
module.exports = {
  'my test': {
    // ... test config
  },
  'my other test': {
    // ... test config
  }
};
```

</TabItem>
</Tabs>

## Constant export

You can also expose specific named exports:

<!-- prettier-ignore -->
<Tabs
  groupId="language"
  defaultValue="ts"
  values={[
    { label: 'TypeScript', value: 'ts', },
    { label: 'JavaScript', value: 'js', },
  ]
}>
<TabItem value="ts">

```typescript
// .betterer.ts
export const myTest = {
  // ... test config
};

export const myOtherTest = {
  // ... test config
};
```

</TabItem>
<TabItem value="js">

```javascript
// .betterer.js
module.exports.myTest = {
  // ... test config
};

module.exports.myOtherTest = {
  // ... test config
};
```

</TabItem>
</Tabs>

:::info
You can also define your tests in other files and then re-export them from the test definition file! If you write a test that would be useful for others, please publish it as a package!
:::
