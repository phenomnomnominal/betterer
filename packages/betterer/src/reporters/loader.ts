import { COULDNT_LOAD_REPORTER, NO_REPORTER_LOADED, UNKNOWN_HOOK_NAME, HOOK_NOT_A_FUNCTION } from '../errors';
import { requireUncached } from '../require';
import { BettererMultiReporterΩ } from './reporter-multi';
import { BettererReporterNames, BettererReporter, BettererReporterModule } from './types';
import { isFunction } from '../utils';

export const DEFAULT_REPORTER = '@betterer/reporter';
export const WATCH_REPORTER = '@betterer/watch-reporter';

const HOOK_NAMES: ReadonlyArray<keyof BettererReporter> = [
  'contextStart',
  'contextEnd',
  'contextError',
  'runsStart',
  'runsEnd',
  'runStart',
  'runEnd'
];

export function loadReporters(reporterNames: BettererReporterNames): BettererMultiReporterΩ {
  const reporters: Array<BettererReporter> = reporterNames.map((name) => {
    try {
      const module: BettererReporterModule = requireUncached(name);
      if (!module || !module.reporter) {
        throw NO_REPORTER_LOADED(name);
      }
      validate(module.reporter);
      return module.reporter;
    } catch (e) {
      throw COULDNT_LOAD_REPORTER(name, e);
    }
  });
  return new BettererMultiReporterΩ(reporters);
}

function validate(result: unknown): asserts result is BettererReporter {
  const reporter = result as BettererReporter;
  Object.keys(reporter).forEach((key) => {
    const hookName = key as keyof BettererReporter;
    if (!HOOK_NAMES.includes(hookName)) {
      throw UNKNOWN_HOOK_NAME(hookName);
    }
    if (!isFunction(reporter[hookName])) {
      throw HOOK_NOT_A_FUNCTION(hookName);
    }
  });
}
