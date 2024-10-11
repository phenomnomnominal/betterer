import type { BettererConfigContext, BettererOptionsContextOverride } from '../context/index.js';
import type { BettererConfigFS } from '../fs/index.js';
import type { BettererConfigReporter, BettererOptionsReporterOverride } from '../reporters/index.js';
import type { BettererConfigWatcher, BettererOptionsWatcherOverride } from '../runner/index.js';

/**
 * @public Full validated config object for **Betterer**.
 */
export interface BettererConfig
  extends BettererConfigFS,
    BettererConfigReporter,
    BettererConfigContext,
    BettererConfigWatcher {}

/**
 * @public Options for when you override the config via the {@link @betterer/betterer#BettererContext.options | `BettererContext.options()` API}.
 *
 * @remarks The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export interface BettererOptionsOverride
  extends BettererOptionsContextOverride,
    BettererOptionsReporterOverride,
    BettererOptionsWatcherOverride {}
