import { Command } from 'commander';

import { ci } from './ci';
import { init } from './init';
import { merge } from './merge';
import { precommit } from './precommit';
import { start } from './start';
import { results } from './results';
import { BettererCLIArguments, BettererCommand, BettererCommandName, BettererPackageJSON } from './types';
import { watch } from './watch';
import { upgrade } from './upgrade';

// HACK:
// It's easier to use require than to try to get `await import`
// to work right for the package.json...
/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require('../package.json') as BettererPackageJSON;

/**
 * @internal This could change at any point! Please don't use!
 *
 * Run the **Betterer** command-line interface.
 */
export async function cli__(cwd: string, argv: BettererCLIArguments, isCI = process.env.CI === 'true'): Promise<void> {
  const program = new Command('Betterer');
  program.version(version);

  // Init:
  program.addCommand(init(cwd));

  // Run:
  program.addCommand(start(cwd, isCI));
  program.addCommand(watch(cwd));

  // Precommit:
  // Throw if test run is worse, `git add` if better
  program.addCommand(precommit(cwd));

  // CI:
  // Throw if test run creates a diff
  program.addCommand(ci(cwd));

  // Merge:
  program.addCommand(merge(cwd));

  // Results:
  program.addCommand(results(cwd));

  // Upgrade:
  program.addCommand(upgrade(cwd));

  const args = argv.slice(0);
  const [, , command] = args;
  if (!BettererCommand[command as BettererCommandName]) {
    args.splice(2, 0, BettererCommand.start);
  }

  await program.parseAsync(args);
}
