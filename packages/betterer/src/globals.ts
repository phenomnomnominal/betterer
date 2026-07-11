import type { BettererError } from '@betterer/errors';
import type { BettererOptions } from './api/index.js';
import type { BettererConfig } from './config/types.js';
import type { BettererFileResolver, BettererFSWorker, BettererOptionsWatcher } from './fs/index.js';
import type { BettererReporterΩ } from './reporters/index.js';
import type { BettererResults } from './results/index.js';
import type { BettererRunWorkerPool } from './run/types.js';
import type { BettererTestMetaLoaderWorker } from './test/index.js';

import { invariantΔ } from '@betterer/errors';
import { importWorkerΔ } from '@betterer/worker';

import { createContextConfig, enableMode } from './context/index.js';
import { BettererFileResolverΩ, createFSConfig } from './fs/index.js';
import { createReporterConfig, loadDefaultReporter } from './reporters/index.js';
import { createResultsConfig, createResultsStore } from './results/index.js';
import { createRunWorkerPool } from './run/index.js';

class BettererGlobalResolvers {
  public base: BettererFileResolver;

  public constructor(config: BettererConfig) {
    this.base = new BettererFileResolverΩ(config.basePath);
  }
}

class BettererGlobals {
  public readonly resolvers: BettererGlobalResolvers = new BettererGlobalResolvers(this.config);

  constructor(
    public readonly config: BettererConfig,
    public readonly fs: BettererFSWorker,
    private readonly _reporter: BettererReporterΩ | null,
    private readonly _results: BettererResults | null,
    private readonly _runWorkerPool: BettererRunWorkerPool | null,
    private readonly _testMetaLoader: BettererTestMetaLoaderWorker | null
  ) {}

  public get reporter(): BettererReporterΩ {
    invariantΔ(this._reporter, `\`reporter\` should only be accessed on the main thread!`);
    return this._reporter;
  }

  public get results(): BettererResults {
    invariantΔ(this._results, `\`results\` should only be accessed on the main thread!`);
    return this._results;
  }

  public get runWorkerPool(): BettererRunWorkerPool {
    invariantΔ(this._runWorkerPool, `\`runWorkerPool\` should only be accessed on the main thread!`);
    return this._runWorkerPool;
  }

  public get testMetaLoader(): BettererTestMetaLoaderWorker {
    invariantΔ(this._testMetaLoader, `\`testMetaLoader\` should only be accessed on the main thread!`);
    return this._testMetaLoader;
  }
}

let GLOBAL_CONTAINER: BettererGlobals | null = null;

export async function createGlobals(
  options: BettererOptions,
  optionsWatch: BettererOptionsWatcher = {}
): Promise<void> {
  let errorReporter = loadDefaultReporter();

  try {
    const configContext = await createContextConfig(options);
    const configFS = await createFSConfig(configContext, options, optionsWatch);
    const configResults = await createResultsConfig(configFS, options);

    const [configReporter, reporter] = await createReporterConfig(configFS, options);
    errorReporter = reporter;

    const fs: BettererFSWorker = await importWorkerΔ('./fs/fs.worker.js');
    const testMetaLoader: BettererTestMetaLoaderWorker = await importWorkerΔ('./test/test-meta/loader.worker.js');

    const config = enableMode({
      ...configContext,
      ...configFS,
      ...configResults,
      ...configReporter
    });

    const results = await createResultsStore(config);
    await fs.api.init(config);

    const runWorkerPool = await createRunWorkerPool(config.workers);

    setGlobals(config, fs, reporter, results, runWorkerPool, testMetaLoader);
  } catch (error) {
    await errorReporter.configError(options, error as BettererError);
    throw error;
  }
}

export function getGlobals(): BettererGlobals {
  invariantΔ(GLOBAL_CONTAINER, '`createGlobals` must be called before trying to use globals!');
  return GLOBAL_CONTAINER;
}

export function setGlobals(...globals: ConstructorParameters<typeof BettererGlobals>): void {
  GLOBAL_CONTAINER = new BettererGlobals(...globals);
}

export function setWorkerGlobals(config: BettererConfig, fs: BettererFSWorker): void {
  setGlobals(config, fs, null, null, null, null);
}

export async function destroyGlobals(): Promise<void> {
  if (!GLOBAL_CONTAINER) {
    return;
  }
  const { fs, runWorkerPool, testMetaLoader } = getGlobals();
  await Promise.all([fs.destroy(), runWorkerPool.destroy(), testMetaLoader.destroy()]);
  GLOBAL_CONTAINER = null;
}
