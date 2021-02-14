import { betterer } from '@betterer/betterer';

import { watchOptions } from './options';
import { BettererCLIArguments } from './types';

/** @internal Definitely not stable! Please don't use! */
export async function watchΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const { config, results, filter, ignore, reporter, silent, tsconfig } = watchOptions(argv);

  const runner = await betterer.watch({
    configPaths: config,
    cwd,
    filters: filter,
    ignores: ignore,
    reporters: reporter,
    resultsPath: results,
    silent,
    tsconfigPath: tsconfig,
    watch: true
  });

  return new Promise((): void => {
    process.on('SIGINT', () => {
      void runner.stop(true);
    });
  });
}
