import { BettererConfig, createConfig } from './config';
import { createVersionControl, BettererVersionControl } from './fs';
import { registerExtensions } from './register';
import { BettererReporterΩ, DEFAULT_REPORTER, loadReporters } from './reporters';

export async function createGlobals(
  options: unknown = {}
): Promise<[BettererConfig, BettererReporterΩ, BettererVersionControl]> {
  let reporter = loadReporters([DEFAULT_REPORTER]);
  try {
    const versionControl = await createVersionControl();
    const config = await createConfig(options);
    const { cache, cwd, reporters, silent } = config;
    if (cache) {
      versionControl.enableCache(config.cachePath);
    }
    if (silent) {
      reporter = loadReporters([]);
    }
    if (reporters.length > 0) {
      reporter = loadReporters(reporters, cwd);
    }
    await registerExtensions(config);
    return [config, reporter, versionControl];
  } catch (error) {
    await reporter.configError(options, error);
    throw error;
  }
}
