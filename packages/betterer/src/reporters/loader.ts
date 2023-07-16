import type { BettererOptionsReporters } from '../config';
import type { BettererReporter, BettererReporterModule } from './types';

import { BettererError } from '@betterer/errors';
import * as path from 'path';

import { requireUncached } from '../require';
import { isFunction, isString } from '../utils';
import { BettererReporterΩ } from './reporter';

const DEFAULT_REPORTER = '@betterer/reporter';
const HOOK_NAMES = Object.getOwnPropertyNames(BettererReporterΩ.prototype) as ReadonlyArray<keyof BettererReporter>;

export function loadDefaultReporter(): BettererReporterΩ {
  const module = requireUncached<BettererReporterModule>(DEFAULT_REPORTER);
  return new BettererReporterΩ([module.reporter]);
}

export function loadReporters(reporters: BettererOptionsReporters, cwd: string): BettererReporterΩ {
  if (reporters.length === 0) {
    return loadDefaultReporter();
  }

  return new BettererReporterΩ(
    reporters.map((reporter) => {
      if (isString(reporter)) {
        reporter = resolveReporter(cwd, reporter);
        try {
          const module = requireUncached<BettererReporterModule>(reporter);
          if (!module || !module.reporter) {
            throw new BettererError(`"${reporter}" didn't create a reporter. 😔`);
          }
          validate(module.reporter);
          return module.reporter;
        } catch (error) {
          throw new BettererError(`could not require "${reporter}". 😔`, error as BettererError);
        }
      }
      validate(reporter);
      return reporter;
    })
  );
}

export function loadSilentReporter(): BettererReporterΩ {
  return new BettererReporterΩ([]);
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

function resolveReporter(cwd: string, reporter: string): string {
  try {
    // Local file:
    return require.resolve(path.resolve(cwd, reporter));
  } catch {
    // npm module:
    return reporter;
  }
}
