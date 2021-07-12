import { destroyAll } from '@phenomnomnominal/worker-require';
import assert from 'assert';

import { BettererContextΩ, BettererContextStarted } from '../context';
import { BettererFilePaths } from '../fs';
import { BettererSuiteSummary } from '../suite';
import { BettererGlobals } from '../types';
import { normalisedPath } from '../utils';
import { BettererRunHandler, BettererRunner, BettererRunnerJobs } from './types';

const DEBOUNCE_TIME = 200;

export class BettererRunnerΩ implements BettererRunner {
  private _context: BettererContextΩ;
  private _jobs: BettererRunnerJobs = [];
  private _running: Promise<BettererSuiteSummary> | null = null;
  private _started: BettererContextStarted;

  constructor(globals: BettererGlobals) {
    this._context = new BettererContextΩ(globals);

    this._started = this._context.start();
  }

  public async run(filePaths: BettererFilePaths): Promise<BettererSuiteSummary> {
    this._addJob(filePaths);
    await this._processQueue();
    return this.stop();
  }

  public queue(filePathOrPaths: string | BettererFilePaths = [], handler?: BettererRunHandler): Promise<void> {
    const filePaths: BettererFilePaths = Array.isArray(filePathOrPaths) ? filePathOrPaths : [filePathOrPaths as string];
    this._addJob(filePaths, handler);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        void (async () => {
          try {
            await this._processQueue();
          } catch (error) {
            reject(error);
          }
          resolve();
        })();
      }, DEBOUNCE_TIME);
    });
  }

  public async stop(): Promise<BettererSuiteSummary>;
  public async stop(force: true): Promise<null>;
  public async stop(force?: true): Promise<BettererSuiteSummary | null> {
    try {
      assert(this._running);
      await this._running;
      const contextSummary = await this._started.end();
      return contextSummary.lastSuite;
    } catch (e) {
      if (force) {
        return null;
      }
      throw e;
    } finally {
      destroyAll();
    }
  }

  private _addJob(filePaths: BettererFilePaths = [], handler?: BettererRunHandler): void {
    const normalisedPaths = filePaths.map(normalisedPath);
    this._jobs.push({ filePaths: normalisedPaths, handler });
  }

  private async _processQueue(): Promise<void> {
    if (this._jobs.length) {
      try {
        const filePaths = new Set<string>();
        this._jobs.forEach((job) => {
          job.filePaths.forEach((path) => {
            filePaths.add(path);
          });
        });
        const changed = Array.from(filePaths).sort();
        const handlers = this._jobs.map((job) => job.handler);
        this._jobs = [];

        this._running = this._context.run(changed);
        const suiteSummary = await this._running;

        handlers.forEach((handler) => handler?.(suiteSummary));
      } catch (error) {
        await this._started.error(error);
      }
    }
  }
}
