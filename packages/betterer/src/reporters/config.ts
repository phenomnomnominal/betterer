import type { BettererConfig } from '../config/index.js';
import type { BettererConfigFS } from '../fs/index.js';
import type {
  BettererConfigReporter,
  BettererOptionsReporter,
  BettererOptionsReporterOverride,
  BettererReporter
} from './types.js';

import { toArray, validateBool } from '../config/index.js';
import { loadReporters, loadSilentReporter } from './loader.js';

export function createReporterConfig(
  configBase: BettererConfigFS,
  options: BettererOptionsReporter
): BettererConfigReporter {
  const { cwd } = configBase;

  const logo = options.logo || false;

  const reporters = toArray<string | BettererReporter>(options.reporters);
  const silent = options.silent || false;

  validateBool({ logo });
  validateBool({ silent });

  const reporter = silent ? loadSilentReporter() : loadReporters(reporters, cwd);

  return {
    logo,
    reporter
  };
}

export function overrideReporterConfig(config: BettererConfig, optionsOverride: BettererOptionsReporterOverride): void {
  if (optionsOverride.reporters) {
    const reporters = toArray<string | BettererReporter>(optionsOverride.reporters);
    config.reporter = loadReporters(reporters, config.cwd);
  }
}
