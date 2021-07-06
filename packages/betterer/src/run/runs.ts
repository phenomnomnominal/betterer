import { BettererConfig } from '../config';
import { BettererFilePaths } from '../fs';
import { BettererResultsΩ } from '../results';
import { isBettererFileTest, loadTests } from '../test';
import { BettererRunΩ } from './run';
import { BettererWorkerPoolΩ } from './worker-pool';
import { BettererRuns } from './types';

export function createRuns(
  pool: BettererWorkerPoolΩ,
  results: BettererResultsΩ,
  config: BettererConfig,
  filePaths: BettererFilePaths
): BettererRuns {
  const testMeta = loadTests(config);
  const testNames = Object.keys(testMeta);

  // Only run BettererFileTests when a list of filePaths is given:
  const runFileTests = filePaths.length > 0;

  return testNames
    .map((name) => {
      const test = testMeta[name].factory();

      if (runFileTests && !isBettererFileTest(test)) {
        return;
      }

      const { isSkipped, config } = test;
      const expected = results.getExpectedResult(name, test);

      const worker = pool.getWorker();
      return new BettererRunΩ(worker, name, config, expected, filePaths, isSkipped);
    })
    .filter(Boolean) as BettererRuns;
}
