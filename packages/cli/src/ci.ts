import { BettererSuiteSummary, betterer, BettererOptionsStart } from '@betterer/betterer';

import { cliOptions } from './options';
import { BettererCLIArguments } from './types';

/**
 * @internal This could change at any point! Please don't use!
 *
 * Run **Betterer** in `ci` mode.
 */
export function ci__(cwd: string, argv: BettererCLIArguments): Promise<BettererSuiteSummary> {
  const { config, exclude, filter, include, results, silent, reporter, tsconfig, workers } = cliOptions(argv);

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
    tsconfigPath: tsconfig,
    workers
  };

  // And then cast to BettererOptionsStart. This is possibly invalid,
  // but it's nicer to do the options validation in @betterer/betterer
  return betterer(options as BettererOptionsStart);
}
