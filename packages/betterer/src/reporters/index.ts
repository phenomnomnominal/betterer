export type { BettererReporterΩ } from './reporter.js';
export type {
  BettererConfigReporter,
  BettererOptionsReporter,
  BettererOptionsReporterOverride,
  BettererOptionsReporters,
  BettererReporter,
  BettererReporterFactory,
  BettererReporterModule,
  BettererRunLogFunction,
  BettererRunLogger
} from './types.js';

export { createReporterConfig, overrideReporterConfig } from './config.js';
export { loadDefaultReporter, loadReporters, loadSilentReporter } from './loader.js';

export function renderError(error: Error): void {
  // eslint-disable-next-line no-console -- Fallback when reporter is not yet available
  console.error(error);
}
