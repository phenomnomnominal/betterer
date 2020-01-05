import { escape } from 'safe-string-literal';

import { Printable } from '../../types';
import { BettererResults } from './types';

const RESULTS_HEADER = `// BETTERER RESULTS V1.`;

// Characters that we avoid escaping to make snapshots easier to visually diff
const UNESCAPED = '"\n';

export async function print(results: BettererResults): Promise<string> {
  const printed = await Promise.all(
    Object.keys(results).map(async resultName => {
      const { timestamp, value } = results[resultName];
      let printedValue = value;
      if (!isString(value)) {
        printedValue = isPrintable(value) ? await value.print() : JSON.stringify(value);
      }
      const escaped = escape(printedValue as string, UNESCAPED);
      return `\nexports[\`${resultName}\`] = {\n  timestamp: ${timestamp},\n  value: \`${escaped}\`\n};`;
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
