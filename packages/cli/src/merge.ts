import { betterer } from '@betterer/betterer';
import { mergeOptions } from './options';
import { BettererCLIArguments } from './types';

/**
 * @internal This could change at any point! Please don't use!
 *
 * Run the **Betterer** `merge` command to resolve any merge conflicts in the
 * specified results file.
 */
export async function merge__(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const { contents, results } = mergeOptions(argv);

  await betterer.merge({ cwd, contents, resultsPath: results });
}
