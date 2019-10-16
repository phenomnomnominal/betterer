import { existsSync } from 'fs';
import { BettererResults } from './types';
import * as dedent from 'dedent';
import to from 'await-to-js';

export async function read(resultsPath: string): Promise<BettererResults> {
  if (!existsSync(resultsPath)) {
    return {};
  }

  const [importError, config = {}] = await to(import(resultsPath));

  if (importError) {
    throw new Error(dedent`
        Failed to load config file at path

          ${resultsPath}

        It resulted in the following error

        ${importError.message}
        ${importError.stack}
      `);
  }

  return config;
}
