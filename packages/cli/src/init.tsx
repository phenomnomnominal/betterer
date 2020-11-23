import { render } from 'ink';
import React from 'react';

import { Init } from './init/init';
import { initOptions } from './options';
import { BettererCLIArguments } from './types';

export async function initΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const { config } = initOptions(argv);

  const app = render(<Init config={config} cwd={cwd} />);
  await app.waitUntilExit();
}
