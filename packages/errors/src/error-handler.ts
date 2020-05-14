import { br, error } from '@betterer/logger';

import { BettererError } from './error';
import { BettererErrorDetails, BettererErrorFactory, BettererErrorMessageFactory } from './types';

const ERROR_MESSAGES = new Map<symbol, BettererErrorMessageFactory>();

export function logError(err: Error | BettererError): void {
  if (isBettererError(err)) {
    const factory = ERROR_MESSAGES.get(err.code) as BettererErrorMessageFactory;
    const errors = err.details.filter((detail) => detail instanceof Error) as Array<Error>;
    const messages = err.details.filter((detail) => !(detail instanceof Error)) as Array<string>;
    err.message = factory(...messages);
    error(err.message);
    errors.forEach(logError);
    return;
  }
  br();
  console.error(err.message, err.stack);
  br();
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

function isBettererError(err: unknown): err is BettererError {
  return !!ERROR_MESSAGES.has((err as BettererError).code);
}
