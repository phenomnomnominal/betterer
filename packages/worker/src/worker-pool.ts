import type { BettererWorkerAPI, BettererWorkerFactory, BettererWorkerHandle, BettererWorkerPool } from './types.js';

import { BettererError } from '@betterer/errors';

/**
 * @internal This could change at any point! Please don't use!
 *
 * @remarks Use this to create a pool of {@link https://nodejs.org/api/worker_threads.html | `Worker`s}, which
 * can then be used to queue asynchronous threaded tasks.
 *
 * It is designed to be used with {@link @betterer/worker#BettererWorkerAPI | `BettererWorkerAPI`} `Worker`s,
 * which are themselves a thin wrapper around {@link https://github.com/GoogleChromeLabs/comlink | `Comlink`}.
 *
 * @param workerCount - The number of `Worker`s to create for the pool.
 *
 * @param workerFactory - A factory function which returns an instance of the specific Worker.
 * The factory should call `importWorker__` with a path to the Worker file.
 */
export function createWorkerPool__<API extends BettererWorkerAPI<unknown>>(
  workerCount: number,
  workerFactory: BettererWorkerFactory<API>
): BettererWorkerPool<API> {
  return new BettererRunWorkerPoolΩ(workerCount, workerFactory);
}

class BettererRunWorkerPoolΩ<API extends BettererWorkerAPI<unknown>> implements BettererWorkerPool<API> {
  private _handles: Array<BettererWorkerHandle<API>> = [];
  private _handleIndex = 0;

  constructor(workerCount: number, workerFactory: BettererWorkerFactory<API>) {
    this._handles = Array.from({ length: workerCount }).map(() => new BettereWorkerHandleΩ(workerFactory()));
  }

  public async destroy(): Promise<void> {
    await Promise.all(this._handles.map((handle) => handle.destroy()));
  }

  public getWorkerHandle(): BettererWorkerHandle<API> {
    const worker = this._handles[this._handleIndex];
    this._handleIndex = this._handleIndex + 1 === this._handles.length ? 0 : this._handleIndex + 1;
    return worker;
  }
}

class BettereWorkerHandleΩ<API extends BettererWorkerAPI<unknown>> implements BettererWorkerHandle<API> {
  constructor(private _worker: API) {}

  private _destroyed = false;

  private _free = Promise.resolve();

  private _release: (() => void) | null = null;

  public async claim(): Promise<API> {
    if (this._destroyed) {
      throw new BettererError(`Handle has been destroyed so cannot be claimed.`);
    }
    await this._free;
    this._free = new Promise<void>((resolve) => {
      this._release = resolve;
    });
    return this._worker;
  }

  public async destroy(): Promise<void> {
    if (this._destroyed) {
      return;
    }
    this._destroyed = true;
    await this._worker.destroy();
  }

  public release(): void {
    if (!this._release) {
      throw new BettererError(`Handle has not been claimed yet so cannot be released.`);
    }
    this._release();
  }
}
