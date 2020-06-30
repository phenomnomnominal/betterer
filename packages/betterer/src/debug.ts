import { debug as debg } from '@betterer/logger';

export function debug(message: string | void): void {
  if (process.env.DEBUG && message) {
    debg(message);
  }
}
