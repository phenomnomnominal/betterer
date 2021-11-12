---
id: caching
title: Caching
slug: /cache
---

**Betterer** has built-in cache functionality for [`BettererFileTest`s](./betterer.bettererfiletest). You can enable it by running **Betterer** with the [`--cache`](./running-betterer#start-options) option. **Betterer** will save a cache file at `.betterer-cache` (or whatever path you specify with the [`--cachePath`](./running-betterer#start-options) option).

**Betterer** will use the cache to avoid checking any files that haven't changed since the previous run. This means **Betterer** can run much faster if a test is using the `filePaths` parameter of [`BettererFileTestFunction`](./betterer.bettererfiletestfunction).

:::caution
Caching is still experimental. Please try it out and [create issues on Github](https://github.com/phenomnomnominal/betterer/issues) if anything is weird. If something is broken, you can just delete the `.betterer.cache` file to reset the cache.
:::
