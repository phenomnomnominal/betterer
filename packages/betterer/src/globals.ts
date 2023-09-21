import type { BettererError } from '@betterer/errors';

import type { BettererOptionsAll } from './config/index.js';
import type { BettererReporterΩ } from './reporters/index.js';
import type { BettererVersionControlWorker } from './fs/types.js';
import type { BettererGlobals } from './types.js';

import { importWorker__ } from '@betterer/worker';

import { createConfig } from './config/index.js';
import { loadDefaultReporter } from './reporters/index.js';
import { BettererResultsFileΩ } from './results/index.js';

export async function createGlobals(options: BettererOptionsAll = {}): Promise<BettererGlobals> {
  const reporter = loadDefaultReporter();
  const versionControl: BettererVersionControlWorker = importWorker__('./fs/version-control.worker.js');
  try {
    const config = await createConfig(options, versionControl);
    if (config.cache) {
      await versionControl.api.enableCache(config.cachePath);
    }
    const resultsFile = await BettererResultsFileΩ.create(config.resultsPath, versionControl);
    return { config, resultsFile, versionControl };
  } catch (error) {
    await versionControl.destroy();
    const reporterΩ = reporter as BettererReporterΩ;
    await reporterΩ.configError(options, error as BettererError);
    throw error;
  }
}
