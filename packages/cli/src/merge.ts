import { BettererResults, mergeResults__, parseResults__, printResults__, writeResults__ } from '@betterer/results';
import * as path from 'path';

import { mergeOptions } from './options';
import { BettererCLIArguments } from './types';

const BETTERER_RESULTS = './.betterer.results';

/**
 * @internal This could change at any point! Please don't use!
 *
 * Run the **Betterer** `merge` command to resolve any merge conflicts in the
 * specified results file.
 */
export async function merge__(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const { contents, results } = mergeOptions(argv);

  const resultsPath = path.resolve(cwd, results || BETTERER_RESULTS);
  let merged: BettererResults;
  if (contents.length) {
    const [ours, theirs] = contents;
    merged = mergeResults__(ours, theirs);
  } else {
    merged = await parseResults__(resultsPath);
  }
  await writeResults__(printResults__(merged), resultsPath);
}
