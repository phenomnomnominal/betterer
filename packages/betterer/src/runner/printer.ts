import { escape } from 'safe-string-literal';

import { BettererContext } from '../context';
import { MaybeAsync } from '../types';

const RESULTS_HEADER = `// BETTERER RESULTS V1.`;

export type Printable = {
  print: () => MaybeAsync<string>;
};

// Characters that we avoid escaping to make snapshots easier to visually diff
const UNESCAPED = '"\n';

export async function print(context: BettererContext): Promise<string> {
  const { results } = context;
  const printed = await Promise.all(
    Object.keys(results).map(async (resultName) => {
      const { timestamp, value } = results[resultName];
      let printedValue = value;
      if (!isString(value)) {
        printedValue = isPrintable(value) ? await value.print() : JSON.stringify(value);
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
  return value && !!(value as Printable).print;
}
