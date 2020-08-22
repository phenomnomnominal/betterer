import { debugΔ } from '@betterer/logger';

export function debug(message: string | void): void {
  if (process.env.DEBUG && message) {
    debugΔ(message);
  }
}
