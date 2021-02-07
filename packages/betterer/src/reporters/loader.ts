import { BettererError } from '@betterer/errors';

import { BettererConfigReporters } from '../config';
import { requireUncached } from '../require';
import { isFunction, isString } from '../utils';
import { BettererReporterΩ } from './reporter';
import { BettererReporter, BettererReporterModule } from './types';

export const DEFAULT_REPORTER = '@betterer/reporter';
export const WATCH_REPORTER = '@betterer/watch-reporter';

const HOOK_NAMES = Object.getOwnPropertyNames(BettererReporterΩ.prototype) as ReadonlyArray<keyof BettererReporter>;

export function loadReporters(reporterConfig: BettererConfigReporters): BettererReporterΩ {
  const reporters: Array<BettererReporter> = reporterConfig.map((reporter) => {
    if (isString(reporter)) {
      let module: BettererReporterModule;
      try {
        module = requireUncached(reporter);
      } catch (e) {
        throw new BettererError(`could not require "${reporter}". 😔`, e);
      }
      if (!module || !module.reporter) {
        throw new BettererError(`"${reporter}" didn't create a reporter. 😔`);
      }
      reporter = module.reporter;
    }
    validate(reporter);
    return reporter;
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
