import assert from 'assert';

import { BettererConfig } from '../config';
import { BettererContextΩ, BettererContextStarted, BettererSummary } from '../context';
import { BettererReporterΩ } from '../reporters';
import { normalisedPath } from '../utils';
import { BettererFilePaths, BettererRunHandler, BettererRunner, BettererRunnerJobs } from './types';

const DEBOUNCE_TIME = 200;

export class BettererRunnerΩ implements BettererRunner {
  private _context: BettererContextΩ;
  private _started: BettererContextStarted;
  private _jobs: BettererRunnerJobs = [];
  private _running: Promise<BettererSummary> | null = null;

  constructor(config: BettererConfig, reporter: BettererReporterΩ) {
    this._context = new BettererContextΩ(config, reporter);
    this._started = this._context.start();
  }

  public queue(filePathOrPaths: string | BettererFilePaths = [], handler?: BettererRunHandler): Promise<void> {
    const filePaths: BettererFilePaths = Array.isArray(filePathOrPaths) ? filePathOrPaths : [filePathOrPaths as string];
    const normalisedPaths = filePaths.map(normalisedPath);
    this._jobs.push({ filePaths: normalisedPaths, handler });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        void (async () => {
          try {
            await this._processQueue();
          } catch (error) {
            await this._started.error(error);
            reject(error);
          }
          resolve();
        })();
      }, DEBOUNCE_TIME);
    });
  }

  public async stop(): Promise<BettererSummary>;
  public async stop(force: true): Promise<null>;
  public async stop(force?: true): Promise<BettererSummary | null> {
    try {
      assert(this._running);
      const summary = await this._running;
      await this._started.end(true);
      return summary;
    } catch (e) {
      if (force) {
        return null;
      }
      throw e;
    }
  }

  private async _processQueue(): Promise<void> {
    if (this._jobs.length) {
      const filePaths = new Set<string>();
      this._jobs.forEach((job) => {
        job.filePaths.forEach((path) => {
          filePaths.add(path);
        });
      });
      const changed = Array.from(filePaths).sort();
      const handlers = this._jobs.map((job) => job.handler);

      this._jobs = [];
      this._running = this._runTests(changed);
      const summary = await this._running;
      handlers.forEach((handler) => handler?.(summary));
    }
  }

  private async _runTests(filePaths: BettererFilePaths): Promise<BettererSummary> {
    try {
      return this._context.run(filePaths);
    } catch (error) {
      await this._started.error(error);
      throw error;
    }
  }
}
