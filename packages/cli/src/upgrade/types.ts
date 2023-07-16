import type { WorkerRequireModule } from '@phenomnomnominal/worker-require';

export type UpgradeConfigFileWorker = WorkerRequireModule<typeof import('./upgrade-config-file')>;
