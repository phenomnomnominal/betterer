import React from 'react';

import { render } from 'ink';
import path from 'path';

import { Init } from './init/init';
import { initOptions } from './options';
import { BettererCLIArguments } from './types';

const BETTERER_TS = './.betterer.ts';
const TS_EXTENSION = '.ts';

/** @internal Definitely not stable! Please don't use! */
export async function initΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const { config } = initOptions(argv);

  const finalConfig = config || BETTERER_TS;
  const ext = path.extname(finalConfig);
  const ts = ext === TS_EXTENSION;

  const app = render(<Init config={finalConfig} cwd={cwd} ts={ts} />);
  await app.waitUntilExit();
}
