import type { BettererWorkerPool } from '@betterer/worker';

import type { BettererRunWorker } from './types.js';

import { createWorkerPoolΔ, importWorkerΔ } from '@betterer/worker';

export function createRunWorkerPool(workers: number): BettererWorkerPool<BettererRunWorker> {
  return createWorkerPoolΔ(workers, async () => await importWorkerΔ('./run.worker.js'));
}
