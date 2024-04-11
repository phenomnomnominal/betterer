import type { BettererOptionsFS } from '../fs/index.js';
import type { BettererOptionsReporter } from '../reporters/index.js';
import type {
  BettererOptionsModeAll,
  BettererOptionsModeStart,
  BettererOptionsModeWatch,
  BettererOptionsRunner,
  BettererOptionsWatcher
} from '../runner/index.js';
import type { BettererOptionsTypeScript } from '../typescript/index.js';
import type { betterer } from './betterer.js';
import type { merge } from './merge.js';
import type { results } from './results.js';
import type { runner } from './runner.js';
import type { watch } from './watch.js';

/**
 * @public Options for when you run **Betterer** via the {@link @betterer/betterer#betterer | `betterer()` API}.
 *
 * @remarks The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptions = BettererOptionsFS &
  BettererOptionsModeAll &
  BettererOptionsRunner &
  BettererOptionsReporter &
  BettererOptionsTypeScript;

/**
 * @public Options for when you run **Betterer** via the {@link @betterer/betterer#betterer | `betterer()` API}.
 *
 * @remarks The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptionsStart = BettererOptionsFS &
  BettererOptionsModeStart &
  BettererOptionsRunner &
  BettererOptionsReporter &
  BettererOptionsTypeScript;

/**
 * @public Options for when you create a {@link @betterer/betterer#BettererResultsSummary | `BettererResultsSummary` }
 * via the {@link @betterer/betterer#results | `betterer.results()` API}.
 *
 * @remarks The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptionsResults = Pick<BettererOptionsFS, 'cwd' | 'configPaths'> &
  Pick<BettererOptionsRunner, 'excludes' | 'filters' | 'includes'>;

/**
 * @public Options for when you create a {@link @betterer/betterer#BettererRunner | `BettererRunner` }
 * via the {@link @betterer/betterer#watch | `betterer.watch()` JS API}.
 *
 * @remarks The options object will be validated by **Betterer** and turned into a {@link @betterer/betterer#BettererConfig | `BettererConfig`}.
 */
export type BettererOptionsWatch = BettererOptionsFS &
  BettererOptionsModeWatch &
  BettererOptionsRunner &
  BettererOptionsReporter &
  BettererOptionsTypeScript &
  BettererOptionsWatcher;

export type BettererAPI = typeof betterer & {
  merge: typeof merge;
  results: typeof results;
  runner: typeof runner;
  watch: typeof watch;
};
