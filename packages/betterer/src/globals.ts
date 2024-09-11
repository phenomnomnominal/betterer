import { BettererError, invariantΔ } from '@betterer/errors';

import type { BettererOptions } from './api/index.js';
import type { BettererConfig } from './config/types.js';
import type { BettererVersionControlWorker } from './fs/index.js';
import type { BettererReporterΩ } from './reporters/index.js';
import type { BettererRunWorkerPool } from './run/types.js';
import type { BettererOptionsWatcher } from './runner/index.js';
import type { BettererTestMetaLoaderWorker } from './test/index.js';

import { createContextConfig, enableMode } from './context/index.js';
import { BettererFSΩ, createFSConfig } from './fs/index.js';
import { createReporterConfig, loadDefaultReporter } from './reporters/index.js';
import { BettererResultsΩ } from './results/index.js';
import { createRunWorkerPool } from './run/index.js';
import { createWatcherConfig } from './runner/index.js';

class BettererGlobals {
  constructor(
    public readonly config: BettererConfig,
    public readonly results: BettererResultsΩ,
    private _runWorkerPool: BettererRunWorkerPool | null,
    private _testMetaLoader: BettererTestMetaLoaderWorker | null,
    public readonly versionControl: BettererVersionControlWorker
  ) {}

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
  let reporter = await loadDefaultReporter();

  try {
    const configContext = await createContextConfig(options);
    const configFS = await createFSConfig(options);
    const configReporter = await createReporterConfig(configFS, options);
    const configWatcher = createWatcherConfig(configFS, optionsWatch);

    const { resultsFile, testMetaLoader, versionControl, versionControlPath } = await BettererFSΩ.create(configFS);

    const config = enableMode({
      ...configContext,
      ...configFS,
      ...configReporter,
      ...configWatcher,
      versionControlPath
    });
    reporter = config.reporter;

    const runWorkerPool = await createRunWorkerPool(config.workers);
    const results = new BettererResultsΩ(await resultsFile.parse());

    setGlobals(config, results, runWorkerPool, testMetaLoader, versionControl);
  } catch (error) {
    const reporterΩ = reporter as BettererReporterΩ;
    await reporterΩ.configError(options, error as BettererError);
    throw error;
  }
}

export function getGlobals(): BettererGlobals {
  if (GLOBAL_CONTAINER === null) {
    throw new BettererError('`createGlobals` must be called before trying to use globals! ❌');
  }
  return GLOBAL_CONTAINER;
}

export function setGlobals(...globals: ConstructorParameters<typeof BettererGlobals>): void {
  GLOBAL_CONTAINER = new BettererGlobals(...globals);
}

export async function destroyGlobals(): Promise<void> {
  const { runWorkerPool, testMetaLoader, versionControl } = getGlobals();
  GLOBAL_CONTAINER = null;
  await runWorkerPool.destroy();
  await testMetaLoader.destroy();
  await versionControl.destroy();
}
