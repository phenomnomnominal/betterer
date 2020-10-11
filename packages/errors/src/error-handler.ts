import { brΔ, errorΔ } from '@betterer/logger';

import { BettererErrorΩ } from './error';
import {
  BettererError,
  BettererErrorDetail,
  BettererErrorDetails,
  BettererErrorFactory,
  BettererErrorMessageFactory,
  ErrorLike
} from './types';

const ERROR_CODES: Array<symbol> = [];

export function logErrorΔ(err: ErrorLike | Error | BettererError): void {
  if (isBettererError(err)) {
    const errors = err.details.filter((detail) => isErrorLike(detail)) as Array<ErrorLike>;
    errorΔ(err.message);
    errors.forEach(logErrorΔ);
    return;
  }
  brΔ();
  // eslint-disable-next-line no-console
  console.error(err.stack);
  brΔ();
}

export function registerError(messageFactory: BettererErrorMessageFactory): BettererErrorFactory {
  const code = Symbol();
  ERROR_CODES.push(code);
  return function factory(...details: BettererErrorDetails): BettererError {
    const error = new BettererErrorΩ(code, ...details);
    const messages = details.filter((detail) => !isErrorLike(detail)) as Array<string>;
    error.message = messageFactory(...messages);
    Error.captureStackTrace(error, factory);
    return error;
  };
}

function isBettererError(err: ErrorLike | Error | BettererError): err is BettererError {
  return !!ERROR_CODES.includes((err as BettererError).code);
}

function isErrorLike(err: BettererErrorDetail): err is ErrorLike {
  return (err as ErrorLike).message != null && (err as ErrorLike).stack !== null;
}
