import { BettererFileIssuesMapSerialised } from './types';

export function printer(serialised: BettererFileIssuesMapSerialised): string {
  let printed = '{\n';
  Object.keys(serialised).forEach((filePath, index) => {
    if (index !== 0) {
      printed += ',\n';
    }
    printed += `    "${filePath}": [\n`;
    serialised[filePath].forEach((mark, index) => {
      if (index !== 0) {
        printed += ',\n';
      }
      const [line, column, length, message, hash] = mark;
      printed += `      [${line}, ${column}, ${length}, ${JSON.stringify(message)}, ${JSON.stringify(hash)}]`;
    });
    printed += `\n    ]`;
  });
  printed += '\n  }';
  return printed;
}
