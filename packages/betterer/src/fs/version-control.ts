import type { BettererVersionControlWorker, BettererVersionControlWorkerModule } from './types.js';

import { workerRequire } from '@phenomnomnominal/worker-require';

export function createVersionControl(): BettererVersionControlWorker {
  const worker = workerRequire<BettererVersionControlWorkerModule>('./version-control-worker');
  return worker.versionControl;
}
