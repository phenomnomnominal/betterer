import type { BettererConfigPaths } from '../fs/index.js';
import type { BettererTestNames } from './types.js';

import { exposeToMain__ } from '@betterer/worker';

import { loadTestMeta } from './loader.js';

export function loadTestNames(configPaths: BettererConfigPaths): BettererTestNames {
  const testMeta = loadTestMeta(configPaths);
  return Object.keys(testMeta);
}

exposeToMain__({
  loadTestNames
});
