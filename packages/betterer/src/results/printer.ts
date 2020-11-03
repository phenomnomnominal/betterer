import { isString } from '../utils';
import { BettererRun } from '../context';
import { escape } from './escaper';
import { serialise } from './serialiser';

export async function print(run: BettererRun): Promise<string> {
  const { name, test } = run;
  const printer = test.printer || defaultPrinter;
  const printedValue = await printer(run, serialise(run));
  const escaped = escape(printedValue);
  return `\nexports[\`${name}\`] = {\n  value: \`${escaped}\`\n};\n`;
}

function defaultPrinter(_: BettererRun, value: unknown): string {
  return isString(value) ? value : JSON.stringify(value);
}
