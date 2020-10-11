import React from 'react';
import commander from 'commander';
import { render } from 'ink';

import { Init } from './init/components';
import { initOptions } from './options';
import { BettererCLIArguments } from './types';

export async function initΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const { config } = initOptions(commander, argv);

  render(<Init config={config} cwd={cwd} />);
}
