import type { BettererConfigPaths } from '../config/types.js';
import type { BettererTestNames } from '../test/index.js';

import { registerExtensions } from '../config/register.js';
import { loadTestMeta } from '../test/index.js';
import { exposeWorker } from '../worker/worker.js';

export async function loadTestNames(
  tsconfigPath: string | null,
  configPaths: BettererConfigPaths
): Promise<BettererTestNames> {
  await registerExtensions(tsconfigPath);
  const testMeta = loadTestMeta(configPaths);
  return Object.keys(testMeta);
}

exposeWorker({
  loadTestNames
});
