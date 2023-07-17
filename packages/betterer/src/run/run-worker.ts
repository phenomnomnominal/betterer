import type { BettererWorkerRunConfig } from '../config/index.js';
import type { BettererFilePaths, BettererVersionControlWorker } from '../fs/index.js';
import type { BettererTestMeta } from '../test/index.js';
import type { BettererRunSummary } from './types.js';

import { BettererWorkerRunΩ } from './worker-run.js';

const TEST_NAME_RUN: Record<string, BettererWorkerRunΩ> = {};

export async function init(
  testName: string,
  options: BettererWorkerRunConfig,
  versionControl: BettererVersionControlWorker
): Promise<BettererTestMeta> {
  const worker = await BettererWorkerRunΩ.create(options, testName, versionControl);
  TEST_NAME_RUN[testName] = worker;
  return worker.testMeta;
}

export function run(
  testName: string,
  filePaths: BettererFilePaths | null,
  isSkipped: boolean,
  timestamp: number
): Promise<BettererRunSummary> {
  const worker = TEST_NAME_RUN[testName];
  return worker.run(filePaths, isSkipped, timestamp);
}
