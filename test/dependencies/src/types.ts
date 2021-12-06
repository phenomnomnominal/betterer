import { WorkerRequireModule } from '@phenomnomnominal/worker-require';

export type TestPackageDependenciesWorker = WorkerRequireModule<typeof import('./test-package-dependencies')>;
