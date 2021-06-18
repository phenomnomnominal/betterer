import { betterer, BettererOptionsWatch } from '@betterer/betterer';

import { cliOptions } from './options';
import { BettererCLIArguments } from './types';

/** @internal Definitely not stable! Please don't use! */
export async function watchΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const { cache, cachePath, config, filter, ignore, reporter, results, silent, tsconfig } = cliOptions(argv);

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
    watch: true
  };

  // And then cast to BettererOptionsWatch. This is possibly invalid,
  // but it's nicer to do the options validation in @betterer/betterer
  const runner = await betterer.watch(options as BettererOptionsWatch);

  return new Promise((): void => {
    process.on('SIGINT', () => {
      void runner.stop(true);
    });
  });
}
