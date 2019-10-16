import { BettererResults } from './types';

const RESULTS_HEADER = `// BETTERER RESULTS V1.`;

export function print(results: BettererResults): string {
  const printed = Object.keys(results).map(resultName => {
    let { timestamp, value } = results[resultName];
    return `\nexports[\`${resultName}\`] = { timestamp: ${timestamp}, value: \`${formatJSON(
      value
    )}\` };`;
  });
  return [RESULTS_HEADER, ...printed].join('');
}

function formatJSON(json: string): string {
  let parsed: string | object = json;
  try {
    parsed = JSON.parse(json);
    if (typeof parsed !== 'object') return parsed;
    if (Array.isArray(parsed)) {
      parsed = `[\n` + parsed.map(v => JSON.stringify(v)).join(',\n') + `\n]`;
    } else {
      parsed =
        '{\n' +
        Object.entries(parsed)
          .map(([key, value]) => `"${key}":${JSON.stringify(value)}`)
          .join(',\n') +
        '\n}';
    }
  } catch {
  } finally {
    return parsed as string;
  }
}
