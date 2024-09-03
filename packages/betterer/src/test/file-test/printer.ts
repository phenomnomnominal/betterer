import type { BettererFileTestResultSerialised } from './types.js';

import { isKey } from './serialiser.js';

export function printer(serialised: BettererFileTestResultSerialised): string {
  let printed = '{\n';
  Object.keys(serialised)
    .sort()
    .filter(isKey)
    .forEach((filePath, index) => {
      const file = `    "${filePath}": [\n`;
      printed += prependNewline(index, file);
      serialised[filePath]?.forEach((issue, index) => {
        const [line, column, length, message, hash] = issue;
        const printedIssue = `      [${String(line)}, ${String(column)}, ${String(length)}, ${JSON.stringify(message)}, ${JSON.stringify(
          hash
        )}]`;
        printed += prependNewline(index, printedIssue);
      });
      printed += `\n    ]`;
    });
  printed += '\n  }';
  return printed;
}

function prependNewline(index: number, str: string): string {
  return `${index === 0 ? '' : ',\n'}${str}`;
}
