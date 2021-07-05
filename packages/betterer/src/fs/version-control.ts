import { WorkerModule, workerRequire } from '@phenomnomnominal/worker-require';
import assert from 'assert';
import memoize from 'fast-memoize';

import { BettererVersionControlWorker } from './types';

let globalVersionControl: BettererVersionControlWorker;

export const createVersionControl = memoize(async function createVersionControl(): Promise<void> {
  const versionControlWorker =
    workerRequire<WorkerModule<typeof import('./version-control-worker')>>('./version-control-worker');
  globalVersionControl = versionControlWorker;
  await versionControlWorker.init();
});

export function getVersionControl(): BettererVersionControlWorker {
  assert(globalVersionControl);
  return globalVersionControl;
}
