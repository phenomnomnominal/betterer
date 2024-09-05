import type { BettererConfig } from '../config/types.js';
import type { BettererFilePaths, BettererVersionControlWorker } from '../fs/index.js';
import type { BettererTestMeta } from '../test/index.js';
import type { BettererRunMeta } from './meta/index.js';
import type { BettererRunSummary } from './types.js';

import { BettererError } from '@betterer/errors';
import { exposeToMainΔ } from '@betterer/worker';

import { BettererWorkerRunΩ } from './worker-run.js';

const TEST_NAME_RUN: Record<string, BettererWorkerRunΩ> = {};

export async function init(
  testMeta: BettererTestMeta,
  config: BettererConfig,
  versionControl: BettererVersionControlWorker
): Promise<BettererRunMeta> {
  const run = await BettererWorkerRunΩ.create(testMeta, config, versionControl);
  TEST_NAME_RUN[testMeta.name] = run;
  return run.runMeta;
}

export function run(
  testName: string,
  filePaths: BettererFilePaths | null,
  isSkipped: boolean,
  timestamp: number
): Promise<BettererRunSummary> {
  const run = TEST_NAME_RUN[testName];
  if (!run) {
    throw new BettererError(`Worker has not been initialised for "${testName}". ❌`);
  }
  return run.run(filePaths, isSkipped, timestamp);
}

exposeToMainΔ({
  init,
  run
});
