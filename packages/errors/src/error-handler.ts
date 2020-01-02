import { error } from '@betterer/logger';

import { BettererError } from './error';

export type ErrorFactory = (...details: Array<unknown>) => BettererError;
export type ErrorMessageFactory = (...details: Array<unknown>) => string;

const ERROR_MESSAGES = new Map<symbol, ErrorMessageFactory>();

export function logError(err: BettererError): void {
  const factory = ERROR_MESSAGES.get(err.code);
  if (factory) {
    error(factory(...err.details));
  }
}

export function registerError(factory: ErrorMessageFactory): ErrorFactory {
  const code = Symbol();
  ERROR_MESSAGES.set(code, factory);
  return function(...details: Array<unknown>): BettererError {
    return new BettererError(code, details);
  };
}
