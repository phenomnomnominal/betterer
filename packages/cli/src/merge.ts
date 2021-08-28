import { BettererResults, merge, parse, print, write } from '@betterer/results';
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
    merged = merge(ours, theirs);
  } else {
    merged = await parse(resultsPath);
  }
  await write(print(merged), resultsPath);
}
