import { BettererRun } from '../../context';
import { BettererFileIssuesMapSerialised } from './types';

export function printer(_: BettererRun, serialised: BettererFileIssuesMapSerialised): string {
  let printed = '{\n';
  Object.keys(serialised)
    .sort()
    .forEach((filePath, index) => {
      const file = `    "${filePath}": [\n`;
      printed += prependNewline(index, file);
      serialised[filePath].forEach((mark, index) => {
        const [line, column, length, message, hash] = mark;
        const issue = `      [${line}, ${column}, ${length}, ${JSON.stringify(message)}, ${JSON.stringify(hash)}]`;
        printed += prependNewline(index, issue);
      });
      printed += `\n    ]`;
    });
  printed += '\n  }';
  return printed;
}

function prependNewline(index: number, str: string): string {
  return `${index === 0 ? '' : ',\n'}${str}`;
}
