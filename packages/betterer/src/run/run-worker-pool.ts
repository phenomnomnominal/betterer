import type { BettererWorkerPool } from '@betterer/worker';

import type { BettererRunWorker } from './types.js';

import { createWorkerPool__, importWorker__ } from '@betterer/worker';

export function createRunWorkerPool(workers: number): Promise<BettererWorkerPool<BettererRunWorker>> {
  return createWorkerPool__(workers, async () => await importWorker__('./run.worker.js'));
}
