import React from 'react';
import { render } from 'ink';

import { Init } from './init/components';
import { initOptions } from './options';
import { BettererCLIArguments } from './types';

export async function initΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const { config } = initOptions(argv);

  render(<Init config={config} cwd={cwd} />);
}
