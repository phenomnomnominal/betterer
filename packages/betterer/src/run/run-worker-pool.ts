import type { BettererWorkerPool } from '@betterer/worker';

import type { BettererRunWorker } from './types.js';

import { createWorkerPool__, importWorker__ } from '@betterer/worker';

export function createRunWorkerPool(workers: number): BettererWorkerPool<BettererRunWorker> {
  return createWorkerPool__(workers, () => importWorker__('./run.worker.js'));
}
