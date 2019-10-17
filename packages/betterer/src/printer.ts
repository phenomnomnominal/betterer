import { BettererResults } from './types';

const RESULTS_HEADER = `// BETTERER RESULTS V1.`;

export function print(results: BettererResults): string {
  const printed = Object.keys(results).map(resultName => {
    let { timestamp, value } = results[resultName];
    return `\nexports[\`${resultName}\`] = { timestamp: ${timestamp}, value: \`${formatJSON(
      value,
      true
    )}\` };`;
  });
  return [RESULTS_HEADER, ...printed].join('');
}

function formatJSON(json: string, recurse = false): string {
  let parsed: string | object = json;
  try {
    parsed = JSON.parse(json);
    if (typeof parsed !== 'object') return parsed;
    if (Array.isArray(parsed)) {
      parsed = parsed
        .map(v => (recurse ? formatJSON(JSON.stringify(v)) : JSON.stringify(v)))
        .join(',\n');
      parsed = `[\n${parsed}\n]`;
    } else {
      parsed = Object.entries(parsed)
        .map(
          ([key, value]) =>
            `"${key}":${
              recurse
                ? formatJSON(JSON.stringify(value))
                : JSON.stringify(value)
            }`
        )
        .join(',\n');
      parsed = `{\n${parsed}\n}`;
    }
  } catch {
  } finally {
    return parsed as string;
  }
}
