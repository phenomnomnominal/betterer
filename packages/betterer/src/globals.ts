import { BettererError } from '@betterer/errors';

import { createInitialConfig, createFinalConfig } from './config';
import { createVersionControl } from './fs';
import { loadDefaultReporter } from './reporters';
import { BettererResultsFileΩ } from './results';
import { BettererGlobals } from './types';

export async function createGlobals(options: unknown = {}): Promise<BettererGlobals> {
  const reporter = loadDefaultReporter();
  try {
    const config = await createInitialConfig(options);
    const versionControl = createVersionControl();
    try {
      await createFinalConfig(options, config, versionControl);
      if (config.cache) {
        await versionControl.enableCache(config.cachePath);
      }
      const resultsFile = await BettererResultsFileΩ.create(config.resultsPath);
      return { config, resultsFile, versionControl };
    } catch (error) {
      await versionControl.destroy();
      throw error;
    }
  } catch (error) {
    await reporter.configError(options, error as BettererError);
    throw error;
  }
}
