import { escape } from 'safe-string-literal';

import { isString } from '../utils';
import { BettererRunΩ } from '../context';
import { serialise } from './serialiser';

// Characters that we avoid escaping to make snapshots easier to visually diff
const UNESCAPED = '"\n';

export async function print(run: BettererRunΩ): Promise<string> {
  const { name, test } = run;
  const printer = test.printer || defaultPrinter;
  const printedValue = await printer(run, serialise(run));
  const escaped = escape(printedValue, UNESCAPED);
  return `\nexports[\`${name}\`] = {\n  value: \`${escaped}\`\n};\n`;
}

function defaultPrinter(_: BettererRunΩ, value: unknown): string {
  return isString(value) ? value : JSON.stringify(value);
}
