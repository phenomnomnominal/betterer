[![Betterer](https://raw.githubusercontent.com/phenomnomnominal/betterer/master/docs/logo.png)](https://phenomnomnominal.github.io/betterer/)

# `@betterer/betterer`

[![npm version](https://img.shields.io/npm/v/@betterer/betterer.svg)](https://www.npmjs.com/package/@betterer/betterer)

JavaScript API for running [**`betterer`**](https://github.com/phenomnomnominal/betterer).

## Usage

```typescript
import { betterer } from '@betterer/betterer';

async function run(): Promise<void> {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, './.betterer.ts');
  const resultsPath = path.resolve(cwd, './.betterer.results');
  const { worse } = await betterer({ configPath, resultsPath, cwd });
  process.exitCode = worse.length !== 0 ? 1 : 0;
}
```
