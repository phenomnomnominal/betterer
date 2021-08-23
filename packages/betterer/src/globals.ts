import { createConfig } from './config';
import { BettererVersionControlWorker, createVersionControl } from './fs';
import { registerExtensions } from './register';
import { loadDefaultReporter } from './reporters';
import { BettererResultsFileΩ } from './results';
import { BettererGlobals } from './types';

export async function createGlobals(options: unknown = {}): Promise<BettererGlobals> {
  const reporter = loadDefaultReporter();
  try {
    const versionControl = await createVersionControl();
    const config = await createConfig(options, versionControl);
    const { cache } = config;
    if (cache) {
      await versionControl.enableCache(config.cachePath);
    }
    await registerExtensions(config);
    const resultsFile = await BettererResultsFileΩ.create(config.resultsPath, versionControl);
    return { config, resultsFile, versionControl };
  } catch (error) {
    await reporter.configError(options, error);
    throw error;
  }
}

export async function createWorkerGlobals(
  options: unknown = {},
  versionControl: BettererVersionControlWorker
): Promise<BettererGlobals> {
  const config = await createConfig(options, versionControl);
  const { cache } = config;

  if (cache) {
    await versionControl.enableCache(config.cachePath);
  }

  await registerExtensions(config);

  const resultsFile = await BettererResultsFileΩ.create(config.resultsPath, versionControl);

  return { config, resultsFile, versionControl };
}
