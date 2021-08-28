import React from 'react';

import { render } from 'ink';
import path from 'path';

import { Init } from './init/init';
import { initOptions } from './options';
import { BettererCLIArguments } from './types';

const BETTERER_TS = './.betterer.ts';
const BETTERER_RESULTS = './.betterer.results';
const TS_EXTENSION = '.ts';

/** @internal Definitely not stable! Please don't use! */
export async function initΔ(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const RENDER_OPTIONS = {
    debug: process.env.NODE_ENV === 'test'
  };

  const { automerge, config, results } = initOptions(argv);

  const finalConfig = config || BETTERER_TS;
  const finalResults = results || BETTERER_RESULTS;
  const ext = path.extname(finalConfig);
  const ts = ext === TS_EXTENSION;

  const app = render(
    <Init automerge={automerge} configPath={finalConfig} cwd={cwd} resultsPath={finalResults} ts={ts} />,
    RENDER_OPTIONS
  );
  await app.waitUntilExit();
}
