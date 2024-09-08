import type { BettererConfig } from '../config/index.js';
import type { BettererConfigFS } from '../fs/index.js';
import type { BettererConfigWatcher, BettererOptionsWatcher, BettererOptionsWatcherOverride } from './types.js';

import { toArray, validateBool, validateStringArray } from '../config/index.js';

export function createWatcherConfig(
  configFS: BettererConfigFS,
  options: BettererOptionsWatcher
): BettererConfigWatcher {
  const ignores = toArray<string>(options.ignores);
  const watch = options.watch ?? false;

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
