import { error } from '@betterer/logger';

import { BettererContext } from '../context';
import { print } from './printer';
import { report } from './reporter';
import { write } from './writer';

export async function process(
  context: BettererContext
): Promise<BettererContext> {
  const { config } = context;
  const { resultsPath } = config;
  report(context);
  const printed = await print(context);

  let printError = '';
  if (resultsPath) {
    try {
      await write(printed, resultsPath);
    } catch {
      printError = `could not write results to "${resultsPath}". 😔`;
    }
  } else {
    printError = `no \`resultsPath\` given. 😔`;
  }

  if (printError) {
    error(printError);
    error('printing to stdout instead:');
    console.log(`\n\n\n${printed}\n\n\n`);
  }

  return context;
}
