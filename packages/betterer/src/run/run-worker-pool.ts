import type { BettererWorkerHandle } from '../worker/types.js';
import type { BettererWorker, BettererWorkerModule } from './types.js';

import assert from 'node:assert';
import { workerRequire } from '@phenomnomnominal/worker-require';

export class BettererRunWorkerHandleΩ implements BettererWorkerHandle {
  public worker: BettererWorker = workerRequire<BettererWorkerModule>('./run-worker', { cache: false });
  public free = Promise.resolve();

  private _release: (() => void) | null = null;

  public claim(): void {
    this.free = new Promise<void>((resolve) => {
      this._release = resolve;
    });
  }

  public async destroy(): Promise<void> {
    await this.worker.destroy();
  }

  public release(): void {
    assert(this._release);
    this._release();
  }
}

export class BettererRunWorkerPoolΩ {
  private _handles: Array<BettererRunWorkerHandleΩ> = [];
  private _handleIndex = 0;

  constructor(workerCount: number) {
    this._handles = Array.from({ length: workerCount }).map(() => new BettererRunWorkerHandleΩ());
  }

  public async destroy(): Promise<void> {
    await Promise.all(this._handles.map((handle) => handle.destroy()));
  }

  public getWorkerHandle(): BettererRunWorkerHandleΩ {
    const worker = this._handles[this._handleIndex];
    this._handleIndex = this._handleIndex + 1 === this._handles.length ? 0 : this._handleIndex + 1;
    return worker;
  }
}
