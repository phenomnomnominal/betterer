import { BettererResults } from './types';

const RESULTS_HEADER = `// BETTERER RESULTS V1.`;

type Printable = {
  print: () => string;
};

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
    printedValue = (printedValue as string).replace(/`/g, '\\`');
    return `\nexports[\`${resultName}\`] = {\n  timestamp: ${timestamp},\n  value: \`${printedValue}\`\n};`;
  });

  return [RESULTS_HEADER, ...printed].join('');
}
