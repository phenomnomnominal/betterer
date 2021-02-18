import { BettererSummary, betterer } from '@betterer/betterer';

import { startOptions } from './options';
import { BettererCLIArguments } from './types';

/** @internal Definitely not stable! Please don't use! */
export function startΔ(cwd: string, argv: BettererCLIArguments): Promise<BettererSummary> {
  const { allowUpdate, config, results, filter, silent, reporter, tsconfig, update } = startOptions(argv);

  return betterer({
    allowUpdate,
    configPaths: config,
    cwd,
    filters: filter,
    reporters: reporter,
    resultsPath: results,
    silent,
    tsconfigPath: tsconfig,
    update
  });
}
