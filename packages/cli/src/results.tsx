import React from 'react';

import { BettererOptionsResults } from '@betterer/betterer';
import { render } from 'ink';

import { resultsOptions } from './options';
import { Results } from './results/results';
import { BettererCLIArguments } from './types';

/**
 * @internal This could change at any point! Please don't use!
 *
 * Run the **Betterer** `results` command to see the status of the {@link @betterer/betterer#BettererTest | `BettererTest`s}
 * in a project.
 */
export async function results__(cwd: string, argv: BettererCLIArguments): Promise<void> {
  const RENDER_OPTIONS = {
    debug: process.env.NODE_ENV === 'test'
  };

  const { config, exclude, filter, include, results } = resultsOptions(argv);

  // Mark options as unknown...
  const options: unknown = {
    configPaths: config,
    cwd,
    excludes: exclude,
    filters: filter,
    includes: include,
    resultsPath: results
  };

  // And then cast to BettererOptionsResults. This is possibly invalid,
  // but it's nicer to do the options validation in @betterer/betterer
  const app = render(<Results options={options as BettererOptionsResults} />, RENDER_OPTIONS);
  await app.waitUntilExit();
}
