import type { BettererError } from '@betterer/errors';

import type { BettererConfig, BettererOptionsOverride } from '../config/index.js';
import type { BettererFilePaths } from '../fs/index.js';
import type { BettererReporterΩ } from '../reporters/index.js';
import type { BettererSuiteSummaries, BettererSuiteSummary } from '../suite/index.js';
import type { BettererContext, BettererContextStarted, BettererContextSummary } from './types.js';

import { overrideContextConfig } from '../context/index.js';
import { BettererFileResolverΩ, parse, write } from '../fs/index.js';
import { overrideReporterConfig } from '../reporters/index.js';
import { overrideWatchConfig } from '../runner/index.js';
import { BettererSuiteΩ } from '../suite/index.js';
import { defer } from '../utils.js';
import { BettererContextSummaryΩ } from './context-summary.js';
import { getGlobals } from '../globals.js';

export class BettererContextΩ implements BettererContext {
  public readonly config: BettererConfig;

  private _started: BettererContextStarted;
  private _suiteSummaries: BettererSuiteSummaries = [];

  constructor() {
    const { config } = getGlobals();
    this.config = config;
    this._started = this._start();
  }

  public async options(optionsOverride: BettererOptionsOverride): Promise<void> {
    // Wait for any pending run to finish, and any existing reporter to render:
    await this._started.end();

    const { config } = getGlobals();

    // Override the config:
    overrideContextConfig(config, optionsOverride);
    await overrideReporterConfig(config, optionsOverride);
    overrideWatchConfig(config, optionsOverride);

    // Start everything again, and trigger a new reporter:
    this._started = this._start();

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- SIGTERM doesn't care about Promises
    process.on('SIGTERM', () => this.stop());
  }

  public async runOnce(): Promise<BettererSuiteSummary> {
    await this.run([], true);
    const summary = await this.stop();
    return summary;
  }

  public async run(specifiedFilePaths: BettererFilePaths, isRunOnce = false): Promise<void> {
    try {
      const { config, results, versionControl } = getGlobals();

      const expected = await parse(config.resultsPath);
      results.sync(expected);
      await versionControl.api.sync();

      const { cwd, ci, includes, excludes, reporter } = config;
      const reporterΩ = reporter as BettererReporterΩ;

      const resolver = new BettererFileResolverΩ(cwd, versionControl);
      resolver.include(...includes);
      resolver.exclude(...excludes);

      const hasSpecifiedFiles = specifiedFilePaths.length > 0;
      const hasGlobalIncludesExcludes = includes.length || excludes.length;

      let filePaths: BettererFilePaths;
      if (hasSpecifiedFiles && hasGlobalIncludesExcludes) {
        // Validate specified files based on global `includes`/`excludes and gitignore rules:
        filePaths = await resolver.validate(specifiedFilePaths);
      } else if (hasSpecifiedFiles) {
        // Validate specified files based on gitignore rules:
        filePaths = await resolver.validate(specifiedFilePaths);
      } else if (hasGlobalIncludesExcludes) {
        // Resolve files based on global `includes`/`excludes and gitignore rules:
        filePaths = await resolver.files();
      } else {
        // When `filePaths` is `[]` the test will use its specific resolver:
        filePaths = [];
      }

      const suite = await BettererSuiteΩ.create(filePaths);
      const suiteLifecycle = defer<BettererSuiteSummary>();

      // Don't await here! A custom reporter could be awaiting
      // the lifecycle promise which is unresolved right now!
      const reportSuiteStart = reporterΩ.suiteStart(suite, suiteLifecycle.promise);
      try {
        const suiteSummary = await suite.run();

        if (!isRunOnce && !ci) {
          const printed = results.printSummary(suiteSummary);
          if (printed) {
            await write(printed, config.resultsPath);
          }
        }

        this._suiteSummaries = [...this._suiteSummaries, suiteSummary];

        // Lifecycle promise is resolved, so it's safe to finally await
        // the result of `reporter.suiteStart`:
        suiteLifecycle.resolve(suiteSummary);
        await reportSuiteStart;

        await reporterΩ.suiteEnd(suiteSummary);
      } catch (error) {
        // Lifecycle promise is rejected, so it's safe to finally await
        // the result of `reporter.suiteStart`:
        suiteLifecycle.reject(error as BettererError);
        await reportSuiteStart;

        await reporterΩ.suiteError(suite, error as BettererError);
      }
    } catch (error) {
      await this._started.error(error as BettererError);
      throw error;
    }
  }

  public async stop(): Promise<BettererSuiteSummary> {
    const { lastSuite } = await this._started.end();
    return lastSuite;
  }

  private _start(): BettererContextStarted {
    const { config, results, versionControl } = getGlobals();

    // Update `reporterΩ` here because `this.options()` may have been called:
    const reporterΩ = config.reporter as BettererReporterΩ;

    const contextLifecycle = defer<BettererContextSummary>();

    // Don't await here! A custom reporter could be awaiting
    // the lifecycle promise which is unresolved right now!
    const reportContextStart = reporterΩ.contextStart(this, contextLifecycle.promise);
    return {
      end: async (): Promise<BettererContextSummary> => {
        const contextSummary = new BettererContextSummaryΩ(config, this._suiteSummaries);

        // Lifecycle promise is resolved, so it's safe to finally await
        // the result of `reporter.contextStart`:
        contextLifecycle.resolve(contextSummary);
        await reportContextStart;

        await reporterΩ.contextEnd(contextSummary);

        const suiteSummaryΩ = contextSummary.lastSuite;
        if (!config.ci) {
          const printedResult = results.printSummary(suiteSummaryΩ);
          if (printedResult) {
            await write(printedResult, config.resultsPath);
            if (config.precommit) {
              await versionControl.api.add(config.resultsPath);
            }
          }
        }
        await versionControl.api.writeCache();

        return contextSummary;
      },
      error: async (error: BettererError): Promise<void> => {
        // Lifecycle promise is rejected, so it's safe to finally await
        // the result of `reporter.contextStart`:
        contextLifecycle.reject(error);
        await reportContextStart;

        await reporterΩ.contextError(this, error);
      }
    };
  }
}
