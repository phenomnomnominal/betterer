import { BettererConfig, BettererOptionsOverride } from '../config';
import { BettererContextΩ } from '../context';
import { BettererFilePaths } from '../fs';
import { createGlobals } from '../globals';
import { BettererSuiteSummary } from '../suite';
import { normalisedPath } from '../utils';
import { BettererRunner } from './types';
import { createWatcher, WATCHER_EVENTS } from './watcher';

const DEBOUNCE_TIME = 200;

export class BettererRunnerΩ implements BettererRunner {
  public config: BettererConfig;

  private _jobs: Array<BettererFilePaths> = [];
  private _running: Promise<void> | null = null;

  private constructor(private _context: BettererContextΩ) {
    this.config = this._context.config;
  }

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

  public async run(filePaths: BettererFilePaths): Promise<BettererSuiteSummary> {
    this._addJob(filePaths);
    await this._processQueue();
    return this.stop();
  }

  public queue(filePathOrPaths: string | BettererFilePaths = []): Promise<void> {
    const filePaths: BettererFilePaths = Array.isArray(filePathOrPaths) ? filePathOrPaths : [filePathOrPaths as string];
    this._addJob(filePaths);
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
      await this._running;
      return this._context.stop();
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
    if (this._jobs.length) {
      const filePaths = new Set<string>();
      this._jobs.forEach((job) => {
        job.forEach((path) => {
          filePaths.add(path);
        });
      });
      const changed = Array.from(filePaths).sort();
      this._jobs = [];

      this._running = this._context.run(changed);
      await this._running;
    }
  }
}
