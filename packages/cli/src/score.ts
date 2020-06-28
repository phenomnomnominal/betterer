import { BettererScores, betterer } from '@betterer/betterer';
import * as commander from 'commander';

import { scoreOptions } from './options';
import { CLIArguments, CLIScoreConfig } from './types';

export function score(cwd: string, argv: CLIArguments): Promise<BettererScores> {
  scoreOptions(commander);

  commander.parse(argv as Array<string>);

  const { results, silent } = (commander as unknown) as CLIScoreConfig;

  return betterer.score({
    cwd,
    resultsPath: results,
    silent
  });
}
