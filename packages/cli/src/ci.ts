import { BettererSuiteSummary, betterer, BettererOptionsStartCI } from '@betterer/betterer';

import { cliOptions } from './options';
import { BettererCLIArguments } from './types';

/** @internal Definitely not stable! Please don't use! */
export function ciΔ(cwd: string, argv: BettererCLIArguments): Promise<BettererSuiteSummary> {
  const { config, exclude, filter, include, results, silent, reporter, tsconfig } = cliOptions(argv);

  // Mark options as unknown...
  const options: unknown = {
    ci: true,
    configPaths: config,
    cwd,
    excludes: exclude,
    filters: filter,
    includes: include,
    reporters: reporter,
    resultsPath: results,
    silent,
    tsconfigPath: tsconfig
  };

  // And then cast to BettererOptionsStartCI. This is possibly invalid,
  // but it's nicer to do the options validation in @betterer/betterer
  return betterer(options as BettererOptionsStartCI);
}
