import { createConfig } from './config';
import { BettererVersionControlWorker, createVersionControl } from './fs';
import { registerExtensions } from './register';
import { DEFAULT_REPORTER, loadReporters } from './reporters';
import { BettererResultsΩ } from './results';
import { BettererGlobals } from './types';

export async function createGlobals(options: unknown = {}): Promise<BettererGlobals> {
  let reporter = loadReporters([DEFAULT_REPORTER]);
  try {
    const versionControl = await createVersionControl();
    const config = await createConfig(options, versionControl);
    const { cache, cwd, reporters, silent } = config;
    if (cache) {
      await versionControl.enableCache(config.cachePath);
    }
    if (silent) {
      reporter = loadReporters([]);
    }
    if (reporters.length > 0) {
      reporter = loadReporters(reporters, cwd);
    }
    await registerExtensions(config);
    const results = await BettererResultsΩ.create(config.resultsPath, versionControl);
    return { config, reporter, results, versionControl };
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

  const reporter = loadReporters([]);
  const results = await BettererResultsΩ.create(config.resultsPath, versionControl);

  return { config, reporter, results, versionControl };
}
