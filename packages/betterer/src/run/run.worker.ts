import type { BettererLogger } from '@betterer/logger';

import type { BettererConfig } from '../config/types.js';
import type { BettererFilePaths, BettererVersionControlWorker } from '../fs/index.js';
import type { BettererResultsWorker } from '../results/index.js';
import type { BettererTest, BettererTestMeta } from '../test/index.js';
import type { BettererRunMeta } from './meta/index.js';
import type { BettererRunSummary } from './types.js';

import { BettererError, isBettererErrorΔ } from '@betterer/errors';
import { exposeToMainΔ } from '@betterer/worker';

import { isBettererResolverTest, isBettererTest } from '../test/index.js';
import { loadTestFactory, BettererWorkerRunΩ } from './worker-run.js';
import { setGlobals } from '../globals.js';

const TEST_META_MAP: Record<string, [BettererTest, BettererTestMeta, BettererRunMeta]> = {};

async function loadTest(
  testMeta: BettererTestMeta,
  results: BettererResultsWorker
): Promise<[BettererTest, BettererRunMeta]> {
  const { name } = testMeta;

  const isNew = !(await results.api.hasBaseline(name));

  const testFactory = await loadTestFactory(testMeta);

  let test: BettererTest | null = null;
  try {
    test = await testFactory();
  } catch (error) {
    if (isBettererErrorΔ(error)) {
      throw error;
    }
  }

  const isTest = isBettererTest(test);
  const isResolverTest = isBettererResolverTest(test);

  if (!test || !(isTest || isResolverTest)) {
    throw new BettererError(`"${name}" must return a \`BettererTest\`.`);
  }

  const { isOnly, isSkipped } = test;

  return [
    test,
    {
      isCacheable: isResolverTest,
      isNew,
      isOnly,
      isSkipped
    }
  ];
}

/** @knipignore part of worker API */
export async function init(
  testMeta: BettererTestMeta,
  config: BettererConfig,
  results: BettererResultsWorker,
  versionControl: BettererVersionControlWorker
): Promise<BettererRunMeta> {
  // If we're in a worker, we need to populate the globals:
  if (process.env.BETTERER_WORKER !== 'false') {
    setGlobals(config, null, results, null, null, versionControl);
  }

  const [test, runMeta] = await loadTest(testMeta, results);
  TEST_META_MAP[testMeta.name] = [test, testMeta, runMeta];
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
  const meta = TEST_META_MAP[testName];
  if (!meta) {
    throw new BettererError(`Worker has not been initialised for "${testName}". ❌`);
  }
  const [test, testMeta, runMeta] = meta;

  const run = new BettererWorkerRunΩ(test.config, logger, testMeta, runMeta);
  return run.run(filePaths, isFiltered, timestamp);
}

exposeToMainΔ({
  init,
  run
});
