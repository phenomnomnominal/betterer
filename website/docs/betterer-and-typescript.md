---
id: betterer-and-typescript
title: Betterer & TypeScript
sidebar_label: Betterer & TypeScript
slug: /betterer-and-typescript
---

**Betterer** and [**TypeScript**](https://www.typescriptlang.org/) work pretty well together 💖. Not only can **Betterer** be used to help migrate a project to **TypeScript**, but **TypeScript** can help validate the types as you write your tests. **TypeScript** is included as one of **Betterer**'s `optionalDependencies`, and it is recommended to use them together.

By default, running the [**Betterer** initialisation script](./installation#adding-betterer-to-your-project) will create a `.betterer.ts` test definition file, and add **TypeScript** as a dependency. You won't ever need to compile the test definition file as **Betterer** uses [`ts-node`](https://github.com/TypeStrong/ts-node).

## TypeScript configuration

If your project contains a [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) file, you can pass it to **Betterer** the [`--tsconfig` option](./running-betterer#start-options).

## Disabling TypeScript

If you _don't_ want to use **TypeScript**, you can opt out by passing a `.js` file to the initialisation script:

```bash
# Run this from the root of your project:
npx @betterer/cli init --config .betterer.js
```

This will skip adding the **TypeScript** dependency, and create a **JavaScript** test definition file at the given path.
