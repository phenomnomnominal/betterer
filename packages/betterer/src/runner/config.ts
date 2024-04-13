import type { BettererConfig } from '../config/index.js';
import type { BettererConfigFS } from '../fs/index.js';
import type { BettererConfigWatcher, BettererOptionsWatcher, BettererOptionsWatcherOverride } from './types.js';

import { toArray, validateBool, validateStringArray } from '../config/index.js';

export function createWatcherConfig(
  configFS: BettererConfigFS,
  options: BettererOptionsWatcher
): BettererConfigWatcher {
  const ignores = toArray<string>(options.ignores);
  const watch = options.watch || false;

  validateStringArray({ ignores });
  validateBool({ watch });

  return { ...configFS, ignores, watch };
}

export function overrideWatchConfig(config: BettererConfig, optionsOverride: BettererOptionsWatcherOverride): void {
  if (optionsOverride.ignores) {
    validateStringArray({ ignores: optionsOverride.ignores });
    config.ignores = toArray<string>(optionsOverride.ignores);
  }
}

export function enableMode(config: BettererConfig): BettererConfig {
  // CI mode:
  if (config.ci) {
    config.precommit = false;
    config.strict = true;
    config.update = false;
    config.watch = false;
    return config;
  }

  // Precommit mode:
  if (config.precommit) {
    config.ci = false;
    config.strict = true;
    config.update = false;
    config.watch = false;
    return config;
  }

  // Strict mode:
  if (config.strict) {
    config.ci = false;
    config.precommit = false;
    config.update = false;
    config.watch = false;
    return config;
  }

  // Update mode:
  if (config.update) {
    config.ci = false;
    config.precommit = false;
    config.strict = false;
    config.watch = false;
    return config;
  }

  // Watch mode:
  if (config.watch) {
    config.ci = false;
    config.precommit = false;
    config.strict = true;
    config.update = false;
    return config;
  }

  return config;
}
