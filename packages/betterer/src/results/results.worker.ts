import type { BettererFilePath } from '../fs/index.js';
import type { BettererTestNames } from '../test/index.js';
import type { BettererResultsSerialised } from './types.js';

import { invariantΔ } from '@betterer/errors';
import { exposeToMainΔ } from '@betterer/worker';
import { BettererResultsΩ } from './results.js';

let results: BettererResultsΩ | null = null;

export async function init(resultsPath: BettererFilePath): Promise<void> {
  results = await BettererResultsΩ.create(resultsPath);
}

export function getBaseline(testName: string): string {
  checkInitialised(results);
  return results.getBaseline(testName);
}

export function getExpected(testName: string): string {
  checkInitialised(results);
  return results.getExpected(testName);
}

export function getExpectedTestNames(): BettererTestNames {
  checkInitialised(results);
  return results.getExpectedTestNames();
}

export function hasBaseline(testName: string): boolean {
  checkInitialised(results);
  return results.hasBaseline(testName);
}

export function write(result: BettererResultsSerialised): Promise<string | null> {
  checkInitialised(results);
  return results.write(result);
}

function checkInitialised(results: BettererResultsΩ | null): asserts results is BettererResultsΩ {
  invariantΔ(results, '`results` should be set when `init` is called!');
}

exposeToMainΔ({
  init,
  getBaseline,
  getExpected,
  getExpectedTestNames,
  hasBaseline,
  write
});
