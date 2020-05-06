import { error } from '@betterer/logger';

import { BettererError } from './error';
import { ErrorDetails, ErrorFactory, ErrorMessageFactory } from './types';

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
  return function (...details: ErrorDetails): BettererError {
    return new BettererError(code, details);
  };
}
