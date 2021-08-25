import { WorkerRequireModule } from '@phenomnomnominal/worker-require';

export type GetResultsSummaryWorker = WorkerRequireModule<typeof import('./get-results-summary')>;
