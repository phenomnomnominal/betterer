import { WorkerRequireModule } from '@phenomnomnominal/worker-require';

export type GetResultsWorker = WorkerRequireModule<typeof import('./get-results')>;
