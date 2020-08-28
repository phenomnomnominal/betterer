import { BettererSummary, betterer } from '@betterer/betterer';
import * as commander from 'commander';

import { startOptions } from './options';
import { BettererCLIArguments, BettererCLIStartConfig } from './types';

export function startΔ(cwd: string, argv: BettererCLIArguments): Promise<BettererSummary> {
  startOptions(commander);

  commander.parse(argv as Array<string>);

  const {
    config,
    results,
    filter,
    silent,
    reporter,
    tsconfig,
    update
  } = (commander as unknown) as BettererCLIStartConfig;

  return betterer({
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
