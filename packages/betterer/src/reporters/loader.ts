import { BettererError } from '@betterer/errors';
import { requireUncached } from '../require';
import { isFunction } from '../utils';
import { BettererReporterΩ } from './reporter';
import { BettererReporter, BettererReporterModule, BettererReporterNames } from './types';

export const DEFAULT_REPORTER = '@betterer/reporter';
export const WATCH_REPORTER = '@betterer/watch-reporter';

const HOOK_NAMES = Object.keys(BettererReporterΩ.prototype) as ReadonlyArray<keyof BettererReporter>;

export function loadReporters(reporterNames: BettererReporterNames): BettererReporterΩ {
  const reporters: Array<BettererReporter> = reporterNames.map((name) => {
    try {
      const module: BettererReporterModule = requireUncached(name);
      if (!module || !module.reporter) {
        throw new BettererError(`"${name}" didn't create a reporter. 😔`);
      }
      validate(module.reporter);
      return module.reporter;
    } catch (e) {
      throw new BettererError(`could not require "${name}". 😔`, e);
    }
  });
  return new BettererReporterΩ(reporters);
}

function validate(result: unknown): asserts result is BettererReporter {
  const reporter = result as BettererReporter;
  Object.keys(reporter).forEach((key) => {
    const hookName = key as keyof BettererReporter;
    if (!HOOK_NAMES.includes(hookName)) {
      throw new BettererError(`"${hookName}" is not a valid reporter hook name. 😔`);
    }
    if (!isFunction(reporter[hookName])) {
      throw new BettererError(`"${hookName}" is not a function. 😔`);
    }
  });
}
