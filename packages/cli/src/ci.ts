import { BettererSummary, betterer } from '@betterer/betterer';
import commander from 'commander';

import { ciOptions } from './options';
import { BettererCLIArguments } from './types';

export function ciΔ(cwd: string, argv: BettererCLIArguments): Promise<BettererSummary> {
  const { config, results, filter, silent, reporter, tsconfig } = ciOptions(commander, argv);

  return betterer({
    allowDiff: false,
    configPaths: config,
    cwd,
    filters: filter,
    reporters: reporter,
    resultsPath: results,
    silent,
    tsconfigPath: tsconfig
  });
}
