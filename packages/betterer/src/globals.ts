import type { BettererError } from '@betterer/errors';

import type { BettererOptions } from './api/index.js';
import type { BettererReporterΩ } from './reporters/index.js';
import type { BettererOptionsWatcher } from './runner/index.js';
import type { BettererGlobals } from './types.js';

import { createContextConfig, enableMode } from './context/index.js';
import { BettererFSΩ, createFSConfig } from './fs/index.js';
import { createReporterConfig, loadDefaultReporter } from './reporters/index.js';
import { BettererResultsΩ } from './results/index.js';
import { createWatcherConfig } from './runner/index.js';

export async function createGlobals(
  options: BettererOptions,
  optionsWatch: BettererOptionsWatcher = {}
): Promise<BettererGlobals> {
  let reporter = await loadDefaultReporter();

  try {
    const configContext = createContextConfig(options);
    const configFS = await createFSConfig(options);
    const configReporter = await createReporterConfig(configFS, options);
    const configWatcher = createWatcherConfig(configFS, optionsWatch);

    const { resultsFile, versionControl, versionControlPath } = await BettererFSΩ.create(configFS);

    const config = enableMode({
      ...configContext,
      ...configFS,
      ...configReporter,
      ...configWatcher,
      versionControlPath
    });
    reporter = config.reporter;

    const results = new BettererResultsΩ(await resultsFile.parse());
    return { config, results, versionControl };
  } catch (error) {
    const reporterΩ = reporter as BettererReporterΩ;
    await reporterΩ.configError(options, error as BettererError);
    throw error;
  }
}
