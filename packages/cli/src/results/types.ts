import type { BettererWorkerAPI } from '@betterer/worker';

export type GetResultsSummaryWorker = BettererWorkerAPI<typeof import('./get-results-summary.worker')>;
