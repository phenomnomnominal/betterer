import { escape } from 'safe-string-literal';

import { isString } from '../utils';
import { BettererRun } from '../context';
import { serialise } from './serialiser';

// Characters that we avoid escaping to make snapshots easier to visually diff
const UNESCAPED = '"\n';

export async function print(run: BettererRun): Promise<string> {
  const { name, test, timestamp } = run;
  const printer = test.printer || defaultPrinter;
  const printedValue = await printer(run, serialise(run));
  const escaped = escape(printedValue, UNESCAPED);
  return `\nexports[\`${name}\`] = {\n  timestamp: ${timestamp},\n  value: \`${escaped}\`\n};`;
}

function defaultPrinter(_: BettererRun, value: unknown): string {
  return isString(value) ? value : JSON.stringify(value);
}
