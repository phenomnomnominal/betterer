import { BettererSuiteSummary, betterer, BettererOptionsStart } from '@betterer/betterer';
import { ci__ } from './ci';

import { cliOptions } from './options';
import { BettererCLIArguments } from './types';

/**
 * @internal This could change at any point! Please don't use!
 *
 * Run **Betterer** in the default mode.
 */
export function start__(
  cwd: string,
  argv: BettererCLIArguments,
  ci = process.env.CI === 'true'
): Promise<BettererSuiteSummary> {
  if (ci) {
    return ci__(cwd, argv);
  }

  const {
    cache,
    cachePath,
    config,
    exclude,
    filter,
    include,
    results,
    reporter,
    silent,
    strict,
    tsconfig,
    update,
    workers
  } = cliOptions(argv);

  // Mark options as unknown...
  const options: unknown = {
    cache,
    cachePath,
    configPaths: config,
    cwd,
    excludes: exclude,
    filters: filter,
    includes: include,
    reporters: reporter,
    resultsPath: results,
    silent,
    strict,
    tsconfigPath: tsconfig,
    update,
    workers
  };

  // And then cast to BettererOptionsStart. This is possibly invalid,
  // but it's nicer to do the options validation in @betterer/betterer
  return betterer(options as BettererOptionsStart);
}
