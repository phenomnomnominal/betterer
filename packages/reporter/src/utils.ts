import { BettererContext } from '@betterer/betterer';
import { BettererError, logError } from '@betterer/errors';

export function contextError(_: BettererContext, error: BettererError, printed: Array<string>): void {
  logError(error);
  process.stdout.write(printed.join(''));
}

export function quote(str: string): string {
  if (!str.startsWith('"')) {
    str = `"${str}`;
  }
  if (!str.endsWith('"')) {
    str = `${str}"`;
  }
  return str;
}
