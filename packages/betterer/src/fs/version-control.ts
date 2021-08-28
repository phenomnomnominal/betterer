import { workerRequire } from '@phenomnomnominal/worker-require';

import { BettererVersionControlWorker, BettererVersionControlWorkerModule } from './types';

export function createVersionControl(): BettererVersionControlWorker {
  const worker = workerRequire<BettererVersionControlWorkerModule>('./version-control-worker');
  return worker.versionControl;
}
