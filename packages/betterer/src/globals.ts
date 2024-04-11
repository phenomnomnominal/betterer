import type { BettererError } from '@betterer/errors';

import type { BettererOptions } from './api/index.js';
import type { BettererReporterΩ } from './reporters/index.js';
import type { BettererOptionsWatcher } from './runner/index.js';
import type { BettererGlobals } from './types.js';

import { BettererFSΩ, createFSConfig } from './fs/index.js';
import { createReporterConfig, loadDefaultReporter } from './reporters/index.js';
import { BettererResultsΩ } from './results/index.js';
import { createRunnerConfig, createWatcherConfig, enableMode } from './runner/index.js';
import { createTypeScriptConfig } from './typescript/index.js';

export async function createGlobals(
  options: BettererOptions,
  optionsWatch: BettererOptionsWatcher = {}
): Promise<BettererGlobals> {
  let reporter = loadDefaultReporter();

  try {
    const configFS = createFSConfig(options);
    const configReporter = createReporterConfig(configFS, options);
    const configRunner = createRunnerConfig(options);
    const configTypeScript = await createTypeScriptConfig(configFS, options);
    const configWatcher = createWatcherConfig(configFS, optionsWatch);

    const { resultsFile, versionControl, versionControlPath } = await BettererFSΩ.create(configFS);

    const config = enableMode({
      ...configFS,
      ...configReporter,
      ...configRunner,
      ...configTypeScript,
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
