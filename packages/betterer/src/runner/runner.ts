import type { FSWatcher } from 'chokidar';
import type { BettererOptions } from '../api/index.js';
import type { BettererOptionsOverride } from '../config/index.js';
import type { BettererFilePaths } from '../fs/index.js';
import type { BettererSuiteSummary } from '../suite/index.js';
import type { BettererOptionsWatcher, BettererRunner } from './types.js';

import { BettererError } from '@betterer/errors';

import { BettererContextΩ } from '../context/index.js';
import { createGlobals, destroyGlobals, getGlobals } from '../globals.js';
import { normalisedPath } from '../utils.js';
import { createWatcher, WATCHER_EVENTS } from './watcher.js';

const DEBOUNCE_TIME = 200;

export class BettererRunnerΩ implements BettererRunner {
  private _jobs: Array<BettererFilePaths> = [];
  private _running: Promise<void> | null = null;
  private _isStopped = false;

  private constructor(
    private readonly _context: BettererContextΩ,
    private readonly _watcher: FSWatcher | null
  ) {}

  public static async create(
    options: BettererOptions,
    optionsWatch: BettererOptionsWatcher = {}
  ): Promise<BettererRunnerΩ> {
    await createGlobals(options, optionsWatch);
    const { config } = getGlobals();
    const watcher = await createWatcher(config);
    const context = new BettererContextΩ();
    const runner = new BettererRunnerΩ(context, watcher);

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

  public async run(): Promise<BettererSuiteSummary> {
    return await this._context.runOnce();
  }

  public queue(filePathOrPaths: string | BettererFilePaths = []): Promise<void> {
    const filePaths: BettererFilePaths = Array.isArray(filePathOrPaths) ? filePathOrPaths : [filePathOrPaths as string];
    if (this._isStopped) {
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
      this._isStopped = true;
      if (!force) {
        await this._running;
      }
      if (this._watcher) {
        await this._watcher.close();
      }
      return await this._context.stop();
    } catch (error) {
      if (force) {
        return null;
      }
      throw error;
    } finally {
      await destroyGlobals();
    }
  }

  private _addJob(filePaths: BettererFilePaths = []): void {
    const normalisedPaths = filePaths.map(normalisedPath);
    this._jobs.push(normalisedPaths);
  }

  private async _processQueue(): Promise<void> {
    // It's possible for the queue debounce to trigger *after* `this.stop()` has been called:
    if (this._isStopped) {
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
