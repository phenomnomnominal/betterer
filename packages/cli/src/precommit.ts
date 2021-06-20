import { BettererSummary, betterer, BettererOptionsStartCI } from '@betterer/betterer';

import { cliOptions } from './options';
import { BettererCLIArguments } from './types';

/** @internal Definitely not stable! Please don't use! */
export function precommitΔ(cwd: string, argv: BettererCLIArguments): Promise<BettererSummary> {
  const { config, exclude, filter, include, results, silent, reporter, tsconfig } = cliOptions(argv);

  // Mark options as unknown...
  const options: unknown = {
    configPaths: config,
    cwd,
    excludes: exclude,
    filters: filter,
    includes: include,
    precommit: true,
    reporters: reporter,
    resultsPath: results,
    silent,
    tsconfigPath: tsconfig
  };

  // And then cast to BettererOptionsStartCI. This is possibly invalid,
  // but it's nicer to do the options validation in @betterer/betterer
  return betterer(options as BettererOptionsStartCI);
}
