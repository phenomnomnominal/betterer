import type { BettererConfigPaths } from '../config/types.js';
import type { BettererTestNames } from './types.js';

import { exposeToMain__ } from '@betterer/worker';

import { registerExtensions } from '../config/register.js';
import { loadTestMeta } from './loader.js';

export async function loadTestNames(
  tsconfigPath: string | null,
  configPaths: BettererConfigPaths
): Promise<BettererTestNames> {
  await registerExtensions(tsconfigPath);
  const testMeta = loadTestMeta(configPaths);
  return Object.keys(testMeta);
}

exposeToMain__({
  loadTestNames
});
