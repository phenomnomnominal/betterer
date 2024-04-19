import type { Command } from 'commander';

import type { BettererCLIInitConfig } from './types.js';

import { React, getRenderOptions, render } from '@betterer/render';

import { Init } from './init/init.js';
import { initCommand } from './options.js';

const BETTERER_JS = './.betterer.js';
const BETTERER_RESULTS = './.betterer.results';

/**
 * Run the **Betterer** `init` command to initialise **Betterer** in a new project.
 */
export function init(cwd: string): Command {
  const command = initCommand();
  command.description('init Betterer in a project');
  command.action(async (config: BettererCLIInitConfig): Promise<void> => {
    const finalConfig = config.config || BETTERER_JS;
    const finalResults = config.results || BETTERER_RESULTS;

    const app = render(
      <Init
        automerge={config.automerge}
        configPath={finalConfig}
        cwd={cwd}
        logo={config.logo}
        resultsPath={finalResults}
      />,
      getRenderOptions(process.env.NODE_ENV)
    );
    await app.waitUntilExit();
  });

  return command;
}
