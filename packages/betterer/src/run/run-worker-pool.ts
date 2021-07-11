import assert from 'assert';
import os from 'os';
import { workerRequire, WorkerModule } from '@phenomnomnominal/worker-require';

import { BettererWorker, BettererWorkers } from './types';

export class BettererRunWorkerPoolΩ {
  private _workers: BettererWorkers = [];
  private _freeWorkers: BettererWorkers = [];

  constructor() {
    os.cpus().forEach(() => this._addNewWorker());
  }

  public destroy(): void {
    this._workers.map((worker) => worker.destroy());
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
    const worker = workerRequire<WorkerModule<typeof import('./run-worker')>>('./run-worker');
    this._workers.push(worker);
    this._freeWorkers.push(worker);
  }
}
