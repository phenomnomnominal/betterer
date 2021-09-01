import { BettererResults, mergeResults__, parseResults__, printResults__, writeResults__ } from '@betterer/results';
import * as path from 'path';

import { mergeOptions } from './options';
import { BettererCLIArguments } from './types';

const BETTERER_RESULTS = './.betterer.results';

/** @internal Definitely not stable! Please don't use! */
export async function mergeΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
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
