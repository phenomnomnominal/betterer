import assert from 'assert';
import os from 'os';
import { workerRequire, WorkerModule } from '@phenomnomnominal/worker-require';

import { BettererWorker, BettererWorkers } from './types';

export class BettererWorkerPoolΩ {
  private _workers: BettererWorkers = [];
  private _freeWorkers: BettererWorkers = [];

  constructor() {
    for (let i = 0; i < os.cpus().length - 1; i++) {
      this._addNewWorker();
    }
  }

  public async close(): Promise<void> {
    await Promise.all(this._workers.map((worker) => worker.destroy()));
  }

  public getWorker(): BettererWorker {
    const worker = this._freeWorkers.pop();
    assert(worker);
    return worker;
  }

  public freeWorker(worker: BettererWorker): void {
    this._freeWorkers.push(worker);
  }

  private _addNewWorker(): void {
    const worker = workerRequire<WorkerModule<typeof import('./worker-run')>>('./worker-run');
    this._workers.push(worker);
    this._freeWorkers.push(worker);
  }
}
