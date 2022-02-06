import { BettererError } from '@betterer/errors';

import { createConfig } from './config';
import { createVersionControl } from './fs';
import { loadDefaultReporter } from './reporters';
import { BettererResultsFileΩ } from './results';
import { BettererGlobals } from './types';

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
