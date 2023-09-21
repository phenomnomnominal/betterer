import type { BettererWorkerAPI } from '@betterer/worker';

export type TestPackageAPIWorker = BettererWorkerAPI<typeof import('./test-package-api.worker.js')>;
