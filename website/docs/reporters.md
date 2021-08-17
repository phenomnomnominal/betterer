---
id: reporters
title: Reporters
sidebar_label: Reporters
slug: /reporters
---

### Default reporter

**Betterer** has a reporter system for hooking into the test runner. The default reporter lives in it's own package ([`@betterer/reporter`](https://www.npmjs.com/package/@betterer/reporter)), and uses [Ink](https://github.com/vadimdemedes/ink) for fancy terminal output:

<!-- prettier-ignore -->
<div className="video__container">
  <video loop autoPlay muted width="100%">
    <source src="/betterer/videos/watch.mp4" type="video/mp4"/>
  </video>
</div>

### Custom reporters

If you want to write your own reporter, you need to implement the [`BettererReporter`](./reporter#bettererreporter) API and export an instance from a JavaScript module:

```typescript
// src/html-reporter.ts
import { BettererContext, BettererContextSummary, BettererReporter } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { promises as fs } from 'fs';

export const reporter: BettererReporter = createHTMLReporter();

function createHTMLReporter(): BettererReporter {
  return {
    contextEnd(contextSummary: BettererContextSummary): Promise<void> {
      return fs.writeFile('report.html', renderHTMLTemplate(contextSummary), 'utf8');
    },
    contextError(_: BettererContext, error: BettererError): void {
      console.log(error);
    }
  };
}

function renderHTMLTemplate(contextSummary: BettererContextSummary): string {
  // ...
}
```

You can then use the [`--reporter`](./running-betterer#start-options) flag when you run **Betterer**:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<!-- prettier-ignore -->
<Tabs
  groupId="package-manager"
  defaultValue="yarn"
  values={[
    { label: 'Yarn', value: 'yarn' },
    { label: 'npm', value: 'npm' },
  ]}>
  <TabItem
    value="yarn">

```bash
yarn betterer --reporter ./src/html-reporter
```

  </TabItem>
  <TabItem
    value="npm">

```bash
npm run betterer --reporter ./src/html-reporter
```

  </TabItem>
</Tabs>
