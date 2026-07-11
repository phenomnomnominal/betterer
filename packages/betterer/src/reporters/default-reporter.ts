import type { BettererError } from '@betterer/errors';
import type { BettererLoggerMessages } from '@betterer/logger';

import type { BettererContext, BettererContextSummary } from '../context/index.js';
import type { BettererRun, BettererRunSummary } from '../run/index.js';
import type { BettererSuite, BettererSuiteSummary } from '../suite/index.js';
import type { BettererReporter } from './types.js';

/**
 * @internal The built-in plain-text {@link BettererReporter | `BettererReporter`}. Lets the engine
 * report results, warnings and errors on its own, without depending on `@betterer/reporter`.
 */
export function createDefaultReporter(): BettererReporter {
  return {
    runLogger: {
      code: () => void 0,
      debug: () => void 0,
      progress: () => void 0,
      info: (run: BettererRun, ...messages: BettererLoggerMessages): void => {
        writeStdout(`${run.name}: ${messages.join(' ')}`);
      },
      success: (run: BettererRun, ...messages: BettererLoggerMessages): void => {
        writeStdout(`${run.name}: ${messages.join(' ')}`);
      },
      warn: (run: BettererRun, ...messages: BettererLoggerMessages): void => {
        writeStdout(`${run.name}: ${messages.join(' ')}`);
      },
      error: (run: BettererRun, ...messages: BettererLoggerMessages): void => {
        writeStdout(`${run.name}: ${messages.join(' ')}`);
      }
    },
    configError(_: unknown, error: BettererError): void {
      writeStdout(error.message);
    },
    contextError(_: BettererContext, error: BettererError): void {
      writeStdout(error.message);
    },
    suiteError(_: BettererSuite, error: BettererError): void {
      writeStdout(error.message);
    },
    runError(runSummary: BettererRunSummary, error: BettererError): void {
      writeStdout(`${runSummary.name}: ${error.message}`);
    },
    runEnd(runSummary: BettererRunSummary): void {
      writeStdout(`${runSummary.name}: ${getRunStatus(runSummary)}`);
    },
    contextEnd(contextSummary: BettererContextSummary): void {
      writeStdout(getSuiteSummary(contextSummary.lastSuite));
    }
  };
}

function writeStdout(message: string): void {
  process.stdout.write(`${message}\n`);
}

function getRunStatus(runSummary: BettererRunSummary): string {
  if (runSummary.isFailed) {
    return 'failed';
  }
  if (runSummary.isComplete) {
    return 'complete';
  }
  if (runSummary.isBetter) {
    return 'better';
  }
  if (runSummary.isNew) {
    return 'new';
  }
  if (runSummary.isRemoved) {
    return 'removed';
  }
  if (runSummary.isObsolete) {
    return 'obsolete';
  }
  if (runSummary.isSkipped) {
    return 'skipped';
  }
  if (runSummary.isUpdated) {
    return 'updated';
  }
  if (runSummary.isWorse) {
    return 'worse';
  }
  if (runSummary.isSame) {
    return 'same';
  }
  return 'ran';
}

function getSuiteSummary(suite: BettererSuiteSummary): string {
  const counts = [
    [suite.new.length, 'new'],
    [suite.better.length, 'better'],
    [suite.completed.length, 'complete'],
    [suite.same.length, 'same'],
    [suite.worse.length, 'worse'],
    [suite.failed.length, 'failed']
  ] as const;

  const detail = counts
    .filter(([count]) => count > 0)
    .map(([count, label]) => `${String(count)} ${label}`)
    .join(', ');
  return `Betterer: ${getTests(suite.runSummaries.length)}${detail ? ` (${detail})` : ''}`;
}

function getTests(count: number): string {
  return count === 1 ? '1 test' : `${String(count)} tests`;
}
