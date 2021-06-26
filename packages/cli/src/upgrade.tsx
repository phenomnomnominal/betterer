import React from 'react';

import { render } from 'ink';

import { Upgrade } from './upgrade/upgrade';
import { upgradeOptions } from './options';
import { BettererCLIArguments } from './types';

/** @internal Definitely not stable! Please don't use! */
export async function upgradeΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const { configs } = upgradeOptions(argv);

  const configPaths = configs ? configs : ['.betterer.ts'];

  const app = render(<Upgrade configPaths={configPaths} cwd={cwd} />);
  await app.waitUntilExit();
}
