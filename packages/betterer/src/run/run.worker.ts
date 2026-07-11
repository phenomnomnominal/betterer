import type { BettererLogger } from '@betterer/logger';

import type { BettererConfig } from '../config/types.js';
import type { BettererFilePaths, BettererFileResolverΩ, BettererFSWorker } from '../fs/index.js';
import type { BettererTestMeta } from '../test/index.js';
import type { BettererRunMeta } from './meta/index.js';
import type { BettererRunSummary } from './types.js';

import { invariantΔ } from '@betterer/errors';
import { exposeToMainΔ } from '@betterer/worker';

import { isBettererFileTest, isBettererResolverTest, isBettererTest } from '../test/index.js';
import { loadTest, BettererWorkerRunΩ } from './worker-run.js';
import { setWorkerGlobals } from '../globals.js';

const RUNS: Record<string, BettererWorkerRunΩ> = {};

/** @knipignore part of worker API */
export async function init(
  testMeta: BettererTestMeta,
  config: BettererConfig,
  fs: BettererFSWorker,
  baseline: string | null,
  expected: string | null
): Promise<BettererRunMeta> {
  // If we're in a worker, we need to populate the globals:
  if (process.env.BETTERER_WORKER !== 'false') {
    setWorkerGlobals(config, fs);
  }

  const { name } = testMeta;

  const test = await loadTest(testMeta);
  const isTest = isBettererTest(test);

  invariantΔ(isTest, `"${name}" must return a \`BettererTest\`!`);

  const { isOnly, isSkipped } = test;
  const isNew = !(baseline && expected);
  const isFileTest = isBettererFileTest(test);
  const hasFilePaths = isBettererResolverTest(test);
  let isCacheable = false;
  if (hasFilePaths) {
    const { resolver } = test;
    const resolverΩ = resolver as BettererFileResolverΩ;
    isCacheable = resolverΩ.isCacheable;
  }

  const runMeta = { hasFilePaths, isCacheable, isFileTest, isNew, isOnly, isSkipped };

  RUNS[testMeta.name] = new BettererWorkerRunΩ(test.config, testMeta, runMeta, baseline, expected);
  return runMeta;
}

/** @knipignore part of worker API */
export function run(
  logger: BettererLogger,
  testName: string,
  filePaths: BettererFilePaths | null,
  isFiltered: boolean,
  timestamp: number
): Promise<BettererRunSummary> {
  const run = RUNS[testName];
  invariantΔ(run, `Worker has not been initialised for "${testName}"!`);
  return run.run(logger, filePaths, isFiltered, timestamp);
}

exposeToMainΔ({
  init,
  run
});
