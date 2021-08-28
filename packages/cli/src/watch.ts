import { betterer, BettererOptionsWatch } from '@betterer/betterer';

import { cliOptions } from './options';
import { BettererCLIArguments } from './types';

/** @internal Definitely not stable! Please don't use! */
export async function watchΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const { cache, cachePath, config, filter, ignore, reporter, results, silent, tsconfig, workers } = cliOptions(argv);

  // Mark options as unknown...
  const options: unknown = {
    cache,
    cachePath,
    configPaths: config,
    cwd,
    filters: filter,
    ignores: ignore,
    reporters: reporter,
    resultsPath: results,
    silent,
    tsconfigPath: tsconfig,
    watch: true,
    workers
  };

  // And then cast to BettererOptionsWatch. This is possibly invalid,
  // but it's nicer to do the options validation in @betterer/betterer
  await betterer.watch(options as BettererOptionsWatch);
}
