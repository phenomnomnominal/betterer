---
id: betterer-and-typescript
title: Betterer & TypeScript
sidebar_label: Betterer & TypeScript
slug: /betterer-and-typescript
---

**Betterer** and [**TypeScript**](https://www.typescriptlang.org/) work pretty well together 💖. Not only can **Betterer** be used to help migrate a project to **TypeScript**, but **TypeScript** can help validate the types as you write your tests. **TypeScript** is included as one of **Betterer**'s `optionalDependencies`, and it is recommended to use them together.

By default, running the [**Betterer** initialisation script](./installation#adding-betterer-to-your-project) will create a `.betterer.ts` test definition file. You don't need to compile the test definition file as **Betterer** uses [`ts-node`](https://github.com/TypeStrong/ts-node). If your project doesn't already have `TypeScript` as a dependency, you will need to add it to your project.

If you _don't_ want to use **TypeScript**, you can ignore the optional dependency and change the extension of your test definition file to `.js`. You'll then need to change the `import/export` syntax to the equivalent `require/module.exports` syntax, or set-up [ECMAScript Modules for your project](https://nodejs.org/api/esm.html).
