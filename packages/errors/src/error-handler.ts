import { br, error } from '@betterer/logger';

import { BettererError } from './error';
import { BettererErrorDetails, BettererErrorFactory, BettererErrorMessageFactory } from './types';

const ERROR_MESSAGES = new Map<symbol, BettererErrorMessageFactory>();

export function logError(err: BettererError): void {
  const factory = ERROR_MESSAGES.get(err.code);
  if (factory) {
    const errors = err.details.filter((detail) => detail instanceof Error);
    const messages = err.details.filter((detail) => !errors.includes(detail));
    error(factory(...messages));
    errors.forEach((e) => {
      if (e instanceof BettererError) {
        logError(e);
      }
      br();
      console.error(e);
    });
  }
}

export function registerError(factory: BettererErrorMessageFactory): BettererErrorFactory {
  const code = Symbol();
  ERROR_MESSAGES.set(code, factory);
  return function factory(...details: BettererErrorDetails): BettererError {
    const error = new BettererError(code, ...details);
    Error.captureStackTrace(error, factory);
    return error;
  };
}
