import { WorkerRequireModule } from '@phenomnomnominal/worker-require';

export type TestPackageAPIWorker = WorkerRequireModule<typeof import('./test-package-api')>;
