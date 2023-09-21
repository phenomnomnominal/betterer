import type { BettererOptionsReporters } from '../config/index.js';
import type { BettererReporter, BettererReporterModule } from './types.js';

import { BettererError } from '@betterer/errors';
import path from 'node:path';

import { importResolve, importUncached } from '../import.js';
import { isFunction, isString } from '../utils.js';
import { BettererReporterΩ } from './reporter.js';

const DEFAULT_REPORTER = '@betterer/reporter';
const HOOK_NAMES = Object.getOwnPropertyNames(BettererReporterΩ.prototype) as ReadonlyArray<keyof BettererReporter>;

export async function loadDefaultReporter(): Promise<BettererReporter> {
  const module = await importUncached<BettererReporterModule>(DEFAULT_REPORTER);
  return new BettererReporterΩ([module.reporter]);
}

export async function loadReporters(reporters: BettererOptionsReporters, cwd: string): Promise<BettererReporter> {
  if (reporters.length === 0) {
    return await loadDefaultReporter();
  }

  const loaded = await Promise.all(
    reporters.map(async (reporter) => {
      if (isString(reporter)) {
        reporter = resolveReporter(cwd, reporter);
        try {
          const module = await importUncached<BettererReporterModule>(reporter);
          if (!module || !module.reporter) {
            throw new BettererError(`"${reporter}" didn't create a reporter. 😔`);
          }
          validate(module.reporter);
          return module.reporter;
        } catch (error) {
          throw new BettererError(`could not import "${reporter}". 😔`, error as BettererError);
        }
      }
      validate(reporter);
      return reporter;
    })
  );

  return new BettererReporterΩ(loaded);
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
    return importResolve(path.resolve(cwd, reporter));
  } catch {
    // npm module:
    return reporter;
  }
}
