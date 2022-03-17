---
id: workflow
title: Workflow
slug: /workflow
---

There is not a perfect "one-size-fits-all" workflow for all teams, but here's a few recommendations:

- You should commit the results file (e.g. [`.betterer.results`](./results-file)) to source control. You should think of this file like a [Jest Snapshot file](https://jestjs.io/docs/en/snapshot-testing), and review any changes carefully.

- You should run **Betterer** in Pre-commit mode ([`betterer precommit`](./running-betterer#pre-commit-mode)) as a pre-commit hook - perhaps using [husky](https://typicode.github.io/husky) and [lint-staged](https://github.com/okonet/lint-staged).

- You should run **Betterer** as part of a build pipeline along with other static analysis tools and tests.

- You should run **Betterer** in CI mode ([`betterer ci`](./running-betterer#ci-mode-run-your-tests-and-throw-on-changes)) when running on a build server. When **Betterer** runs in CI mode, it will throw an error when the tests results do not exactly match whatever is in the results file. This ensures that the [results file](./results-file) accurately reflects the state of the codebase.

- You should let **Betterer** resolve merge conflicts in the [results file](./results-file) for you. You can run [`betterer merge`](./results-file#merge) when you have a conflict and **Betterer** will fix them for you.
