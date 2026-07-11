import type { BettererConfigResults, BettererResults } from './types.js';

import { BettererError, invariantΔ } from '@betterer/errors';

import { BettererResultsDir } from './results-dir.js';
import { BettererResultsFile } from './results-file.js';

export async function createResultsStore(config: BettererConfigResults): Promise<BettererResults> {
  const { resultsStrategy, resultsPath, resultsDir } = config;
  if (resultsStrategy === 'file') {
    invariantΔ(resultsPath, '`resultsPath` should be set for the "file" results strategy!', resultsPath);
    return await BettererResultsFile.create(resultsPath);
  }
  if (resultsStrategy === 'directory') {
    invariantΔ(resultsDir, '`resultsDir` should be set for the "directory" results strategy!', resultsDir);
    return await BettererResultsDir.create(resultsDir);
  }
  throw new BettererError(`the "${resultsStrategy}" results strategy is not yet implemented. 😔`);
}
