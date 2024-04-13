import type { BettererConfigContext, BettererOptionsContextOverride } from '../context/index.js';
import type { BettererConfigFS } from '../fs/index.js';
import type { BettererConfigReporter, BettererOptionsReporterOverride } from '../reporters/index.js';
import type { BettererConfigWatcher, BettererOptionsWatcherOverride } from '../runner/index.js';
import type { BettererConfigTypeScript } from '../typescript/index.js';

/**
 * @public Full validated config object for **Betterer**.
 */
export interface BettererConfig
  extends BettererConfigFS,
    BettererConfigReporter,
    BettererConfigContext,
    BettererConfigTypeScript,
    BettererConfigWatcher {
  /**
   * The path to the local version control root.
   *
   * @remarks you might think that this should live on `BettererConfigFS`,
   * but it can't! The `versionControlPath` is inferred from the instantiated
   * `BettererVersionControl` instance, rather than being passed as options by the
   * user.
   */
  versionControlPath: string;
}

/**
 * @public Options for when you override the config via the {@link @betterer/betterer#BettererContext.options | `BettererContext.options()` API}.
 *
 * @remarks The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export interface BettererOptionsOverride
  extends BettererOptionsContextOverride,
    BettererOptionsReporterOverride,
    BettererOptionsWatcherOverride {}
