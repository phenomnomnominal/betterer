import type { BettererOptionsOverride } from '../config';
import type { BettererFilePaths } from '../fs';
import type { BettererSuiteSummary } from '../suite';
import type { BettererRunner } from './types';

import { BettererError } from '@betterer/errors';

import { BettererContextΩ } from '../context';
import { createGlobals } from '../globals';
import { normalisedPath } from '../utils';
import { createWatcher, WATCHER_EVENTS } from './watcher';

const DEBOUNCE_TIME = 200;

export class BettererRunnerΩ implements BettererRunner {
  private _jobs: Array<BettererFilePaths> = [];
  private _running: Promise<void> | null = null;

  private constructor(private _context: BettererContextΩ) {}

  public static async create(options: unknown): Promise<BettererRunnerΩ> {
    const globals = await createGlobals(options);
    const watcher = await createWatcher(globals);

    const context = new BettererContextΩ(globals, watcher);
    const runner = new BettererRunnerΩ(context);

    if (watcher) {
      watcher.on('all', (event: string, filePath: string) => {
        if (WATCHER_EVENTS.includes(event)) {
          void runner.queue([filePath]);
        }
      });
    }

    return runner;
  }

  public async options(optionsOverride: BettererOptionsOverride): Promise<void> {
    await this._context.options(optionsOverride);
  }

  public run(): Promise<BettererSuiteSummary> {
    return this._context.runOnce();
  }

  public queue(filePathOrPaths: string | BettererFilePaths = []): Promise<void> {
    const filePaths: BettererFilePaths = Array.isArray(filePathOrPaths) ? filePathOrPaths : [filePathOrPaths as string];
    if (this._context.isDestroyed) {
      throw new BettererError('You cannot queue a test run after the runner has been stopped! 💥');
    }
    this._addJob(filePaths);
    return new Promise((resolve) => {
      setTimeout(() => {
        void (async () => {
          await this._processQueue();
          resolve();
        })();
      }, DEBOUNCE_TIME);
    });
  }

  public async stop(): Promise<BettererSuiteSummary>;
  public async stop(force: true): Promise<BettererSuiteSummary | null>;
  public async stop(force?: true): Promise<BettererSuiteSummary | null> {
    try {
      if (!force) {
        await this._running;
      }
      return await this._context.stop();
    } catch (error) {
      if (force) {
        return null;
      }
      throw error;
    }
  }

  private _addJob(filePaths: BettererFilePaths = []): void {
    const normalisedPaths = filePaths.map(normalisedPath);
    this._jobs.push(normalisedPaths);
  }

  private async _processQueue(): Promise<void> {
    // It's possible for the queue debounce to trigger *after* `this.stop()` has been called:
    if (this._context.isDestroyed) {
      this._jobs = [];
      return;
    }

    if (this._jobs.length) {
      const filePaths = new Set<string>();
      this._jobs.forEach((job) => {
        job.forEach((path) => {
          filePaths.add(path);
        });
      });
      const runPaths = Array.from(filePaths).sort();
      this._jobs = [];

      this._running = this._context.run(runPaths);
      try {
        await this._running;
      } catch {
        // Errors will be handled by reporters
      }
    }
  }
}
