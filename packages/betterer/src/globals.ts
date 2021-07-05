import { createConfig } from './config';
import { createVersionControl, getVersionControl } from './fs';
import { registerExtensions } from './register';
import { DEFAULT_REPORTER, loadReporters } from './reporters';
import { BettererResultsΩ } from './results';
import { BettererGlobals } from './types';

export async function createGlobals(options: unknown = {}): Promise<BettererGlobals> {
  let reporter = loadReporters([DEFAULT_REPORTER]);
  try {
    await createVersionControl();
    const versionControl = getVersionControl();
    const config = await createConfig(options);
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
    const results = new BettererResultsΩ(config.resultsPath);
    return { config, reporter, results, versionControl };
  } catch (error) {
    await reporter.configError(options, error);
    throw error;
  }
}
