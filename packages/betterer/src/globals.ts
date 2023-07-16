import type { BettererError } from '@betterer/errors';
import type { BettererGlobals } from './types.js';

import { createConfig } from './config/index.js';
import { createVersionControl } from './fs/index.js';
import { loadDefaultReporter } from './reporters/index.js';
import { BettererResultsFileΩ } from './results/index.js';

export async function createGlobals(options: unknown = {}): Promise<BettererGlobals> {
  const reporter = loadDefaultReporter();
  const versionControl = createVersionControl();
  try {
    const config = await createConfig(options, versionControl);
    if (config.cache) {
      await versionControl.enableCache(config.cachePath);
    }
    const resultsFile = await BettererResultsFileΩ.create(config.resultsPath, versionControl);
    return { config, resultsFile, versionControl };
  } catch (error) {
    await versionControl.destroy();
    await reporter.configError(options, error as BettererError);
    throw error;
  }
}
