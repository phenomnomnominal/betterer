import { BettererContext } from '@betterer/betterer';
import { BettererError, logErrorΔ } from '@betterer/errors';

export function contextErrorΔ(_: BettererContext, error: BettererError, printed: Array<string>): void {
  logErrorΔ(error);
  process.stdout.write(printed.join(''));
}

export function quoteΔ(str: string): string {
  if (!str.startsWith('"')) {
    str = `"${str}`;
  }
  if (!str.endsWith('"')) {
    str = `${str}"`;
  }
  return str;
}
