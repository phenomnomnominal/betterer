import type { BettererWorkerAPI } from '@betterer/worker';

export type CreateTestFileWorker = BettererWorkerAPI<typeof import('./create-test-file.worker')>;
export type EnableAutomergeWorker = BettererWorkerAPI<typeof import('./enable-automerge.worker')>;
export type UpdatePackageJSONWorker = BettererWorkerAPI<typeof import('./update-package-json.worker')>;
