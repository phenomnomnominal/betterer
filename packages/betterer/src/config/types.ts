import type { BettererConfigFS } from '../fs/index.js';
import type { BettererConfigReporter, BettererOptionsReporterOverride } from '../reporters/index.js';
import type {
  BettererConfigRunner,
  BettererConfigWatcher,
  BettererOptionsRunnerOverride,
  BettererOptionsWatcherOverride
} from '../runner/index.js';
import type { BettererConfigTypeScript } from '../typescript/index.js';

/**
 * @public Full validated config object for **Betterer**.
 */
export interface BettererConfig
  extends BettererConfigFS,
    BettererConfigReporter,
    BettererConfigRunner,
    BettererConfigTypeScript,
    BettererConfigWatcher {
  /**
   * @remarks you might think that this should live on `BettererConfigFS`,
   * but it can't! The `versionControlPath` is inferred from the instantiated
   * `BettererVersionControl` instance, rather than being passed as options by the
   * user.
   */
  versionControlPath: string;
}

export interface BettererOptionsOverride
  extends BettererOptionsReporterOverride,
    BettererOptionsRunnerOverride,
    BettererOptionsWatcherOverride {}
