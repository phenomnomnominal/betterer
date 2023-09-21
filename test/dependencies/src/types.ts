import type { BettererWorkerAPI } from '@betterer/worker';

export type TestPackageDependenciesWorker = BettererWorkerAPI<typeof import('./test-package-dependencies.worker.js')>;
