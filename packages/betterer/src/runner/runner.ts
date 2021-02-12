import { BettererConstraintResult } from '@betterer/constraints';
import assert from 'assert';

import { BettererConfigPartial, createConfig } from '../config';
import { BettererContextΩ, BettererRun, BettererRunΩ, BettererSummary } from '../context';
import { registerExtensions } from '../register';
import { DEFAULT_REPORTER, loadReporters } from '../reporters';
import { BettererResultΩ } from '../results';
import { normalisedPath } from '../utils';
import { BettererFilePaths, BettererRunHandler, BettererRunner, BettererRunnerJobs } from './types';

const DEBOUNCE_TIME = 200;

export class BettererRunnerΩ implements BettererRunner {
  private _context: BettererContextΩ | null = null;
  private _jobs: BettererRunnerJobs = [];
  private _running: Promise<BettererSummary> | null = null;

  public async start(partialConfig: BettererConfigPartial = {}): Promise<BettererContextΩ> {
    let config = null;
    let reporter = loadReporters([DEFAULT_REPORTER]);
    try {
      config = await createConfig(partialConfig);
      registerExtensions(config);
      if (config.silent) {
        reporter = loadReporters([]);
      }
      if (config.reporters.length > 0) {
        reporter = loadReporters(config.reporters);
      }
    } catch (error) {
      await reporter.configError(partialConfig, error);
      throw error;
    }

    this._context = new BettererContextΩ(config, reporter);
    await this._context.start();
    return this._context;
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
            assert(this._context);
            await this._context.error(error);
            reject(error);
          }
          resolve();
        })();
      }, DEBOUNCE_TIME);
    });
  }

  public async stop(force: true): Promise<null>;
  public async stop(): Promise<BettererSummary>;
  public async stop(force?: true): Promise<BettererSummary | null> {
    try {
      assert(this._running && this._context);
      const summary = await this._running;
      await this._context.end();
      await this._context.save();
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
    assert(this._context);
    const { config } = this._context;
    try {
      return this._context.run(async (runs) => {
        await Promise.all(
          runs.map(async (run) => {
            const runΩ = run as BettererRunΩ;
            await this._runTest(runΩ, config.update);
            await runΩ.end();
          })
        );
      }, filePaths);
    } catch (error) {
      await this._context.error(error);
      throw error;
    }
  }

  private async _runTest(run: BettererRun, update: boolean): Promise<void> {
    const runΩ = run as BettererRunΩ;
    const { test } = runΩ;

    await runΩ.start();

    if (run.isSkipped) {
      return;
    }

    let result: BettererResultΩ;
    try {
      result = new BettererResultΩ(await test.test(runΩ));
    } catch (e) {
      await runΩ.failed(e);
      return;
    }
    runΩ.ran();

    const goalComplete = await test.goal(result.result);

    if (runΩ.isNew) {
      runΩ.new(result, goalComplete);
      return;
    }

    const comparison = await test.constraint(result.result, runΩ.expected.result);

    if (comparison === BettererConstraintResult.same) {
      runΩ.same(result);
      return;
    }

    if (comparison === BettererConstraintResult.better) {
      runΩ.better(result, goalComplete);
      return;
    }

    if (update) {
      runΩ.update(result);
      return;
    }

    runΩ.worse(result);
    return;
  }
}
