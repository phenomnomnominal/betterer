import { BettererSummary, betterer, BettererOptionsStart } from '@betterer/betterer';

import { ciOptions } from './options';
import { BettererCLIArguments } from './types';

/** @internal Definitely not stable! Please don't use! */
export function ciΔ(cwd: string, argv: BettererCLIArguments): Promise<BettererSummary> {
  const { config, exclude, filter, include, results, silent, reporter, tsconfig } = ciOptions(argv);

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

  // And then cast to BettererOptionsStart. This is possibly invalid,
  // but it's nicer to do the options validation in @betterer/betterer
  return betterer(options as BettererOptionsStart);
}
