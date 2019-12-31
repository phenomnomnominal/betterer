import { error } from '@betterer/logger';

import { promises as fs } from 'fs';
import { escape } from 'safe-string-literal';

import { BettererResults } from './results';
import { Printable } from '../../types';

const RESULTS_HEADER = `// BETTERER RESULTS V1.`;

// Characters that we avoid escaping to make snapshots easier to visually diff
const UNESCAPED = '"\n';

export async function write(
  results: BettererResults,
  resultsPath: string
): Promise<void> {
  const printed = await print(results);

  let printError = '';
  if (resultsPath) {
    try {
      await fs.writeFile(resultsPath, printed, 'utf8');
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
}

async function print(results: BettererResults): Promise<string> {
  const printed = await Promise.all(
    Object.keys(results).map(async resultName => {
      const { timestamp, value } = results[resultName];
      let printedValue = value;
      if (!isString(value)) {
        printedValue = isPrintable(value)
          ? await value.print()
          : JSON.stringify(value);
      }
      return `\nexports[\`${resultName}\`] = {\n  timestamp: ${timestamp},\n  value: \`${escape(
        printedValue as string,
        UNESCAPED
      )}\`\n};`;
    })
  );

  return [RESULTS_HEADER, ...printed].join('');
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isPrintable(value: unknown): value is Printable {
  return value && typeof (value as Printable).print === 'function';
}
