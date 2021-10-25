import React from 'react';

import { render } from 'ink';

import { Upgrade } from './upgrade/upgrade';
import { upgradeOptions } from './options';
import { BettererCLIArguments } from './types';

/**
 * @internal This could change at any point! Please don't use!
 *
 * Run the **Betterer** `upgrade` command to upgrade **Betterer** in an existing project.
 */
export async function upgrade__(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const RENDER_OPTIONS = {
    debug: process.env.NODE_ENV === 'test'
  };

  const { config, save } = upgradeOptions(argv);

  const configPaths = config ? config : ['./.betterer.ts'];

  const app = render(<Upgrade configPaths={configPaths} cwd={cwd} save={save} />, RENDER_OPTIONS);
  await app.waitUntilExit();
}
