import { BettererSummary, betterer } from '@betterer/betterer';
import commander from 'commander';

import { ciOptions } from './options';
import { BettererCLIArguments, BettererCLICIConfig } from './types';

export function ciΔ(cwd: string, argv: BettererCLIArguments): Promise<BettererSummary> {
  ciOptions(commander);

  commander.parse(argv as Array<string>);

  const { config, results, filter, silent, reporter, tsconfig } = (commander as unknown) as BettererCLICIConfig;

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
