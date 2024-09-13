import type { BettererConfig } from '../config/types.js';
import type { BettererFilePaths, BettererVersionControlWorker } from '../fs/index.js';
import type { BettererResultsWorker } from '../results/index.js';
import type { BettererTestMeta } from '../test/index.js';
import type { BettererRunMeta } from './meta/index.js';
import type { BettererRunSummary } from './types.js';

import { BettererError } from '@betterer/errors';
import { exposeToMainΔ } from '@betterer/worker';

import { BettererWorkerRunΩ } from './worker-run.js';

const TEST_NAME_RUN: Record<string, BettererWorkerRunΩ> = {};

/** @knipignore part of worker API */
export async function init(
  testMeta: BettererTestMeta,
  config: BettererConfig,
  results: BettererResultsWorker,
  versionControl: BettererVersionControlWorker
): Promise<BettererRunMeta> {
  const run = await BettererWorkerRunΩ.create(testMeta, config, results, versionControl);
  TEST_NAME_RUN[testMeta.name] = run;
  return run.runMeta;
}

/** @knipignore part of worker API */
export function run(
  testName: string,
  filePaths: BettererFilePaths | null,
  isFiltered: boolean,
  timestamp: number
): Promise<BettererRunSummary> {
  const run = TEST_NAME_RUN[testName];
  if (!run) {
    throw new BettererError(`Worker has not been initialised for "${testName}". ❌`);
  }
  return run.run(filePaths, isFiltered, timestamp);
}

exposeToMainΔ({
  init,
  run
});
