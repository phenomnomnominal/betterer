import { workerRequire, WorkerRequireModuleAsync } from '@phenomnomnominal/worker-require';

import { BettererVersionControlWorker, BettererVersionControlWorkerModule } from './types';

let worker: WorkerRequireModuleAsync<BettererVersionControlWorkerModule>;
let globalVersionControl: BettererVersionControlWorker;

export async function createVersionControl(): Promise<BettererVersionControlWorker> {
  worker = workerRequire<BettererVersionControlWorkerModule>('./version-control-worker');
  globalVersionControl = worker.versionControl;
  await globalVersionControl.init();
  return globalVersionControl;
}

export async function destroyVersionControl(): Promise<void> {
  await worker.destroy();
}
