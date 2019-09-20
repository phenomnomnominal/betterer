import { BetterResults } from './types';

const RESULTS_HEADER = `// BETTER RESULTS V1.`;

export function print(results: BetterResults): string {
  const printed = Object.keys(results).map(resultName => {
    const { timestamp, value } = results[resultName];
    return `\nexports[\`${resultName}\`] = { timestamp: ${timestamp}, value: \`${value}\` };`;
  });
  return [RESULTS_HEADER, ...printed].join('');
}
