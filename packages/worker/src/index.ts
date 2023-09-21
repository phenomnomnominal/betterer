/**
 * Worker helper functions for {@link https://github.com/phenomnomnominal/betterer | **Betterer**}.
 *
 * @packageDocumentation
 */

export type { BettererWorkerAPI, BettererWorkerHandle, BettererWorkerFactory, BettererWorkerPool } from './types.js';

export { exposeToMain__, exposeToWorker__, importWorker__ } from './worker.js';
export { createWorkerPool__ } from './worker-pool.js';
