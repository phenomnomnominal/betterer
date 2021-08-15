import { WorkerRequireModule } from '@phenomnomnominal/worker-require';

export type CreateTestFileWorker = WorkerRequireModule<typeof import('./create-test-file')>;
export type UpdatePackageJSONWorker = WorkerRequireModule<typeof import('./update-package-json')>;
