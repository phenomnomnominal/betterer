import { BettererResults } from './types';
import { escape } from 'safe-string-literal';
import * as path from 'path';

const RESULTS_HEADER = `// BETTERER RESULTS V1.`;

type Printable = {
  print: () => string;
};

/** Characters that we avoid escaping to make snapshots easier to visually diff */
const UNESCAPED = '"\n';

export function print(results: BettererResults): string {
  const printed = Object.keys(results).map(resultName => {
    const { timestamp, value } = results[resultName];
    let printedValue = value;
    if (typeof value !== 'string') {
      printedValue =
        value && (value as Printable).print
          ? (value as Printable).print()
          : JSON.stringify(value);
    }
    printedValue = (printedValue as string).replace(
      process.cwd(),
      `.${path.sep}`
    );
    return `\nexports[\`${resultName}\`] = {\n  timestamp: ${timestamp},\n  value: \`${escape(
      printedValue as string,
      UNESCAPED
    )}\`\n};`;
  });

  return [RESULTS_HEADER, ...printed].join('');
}
