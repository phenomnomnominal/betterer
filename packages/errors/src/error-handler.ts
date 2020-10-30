import { brΔ, errorΔ } from '@betterer/logger';

import { BettererError, isBettererError } from './error';
import { BettererErrorDetail, ErrorLike } from './types';

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

function isErrorLike(err: BettererErrorDetail): err is ErrorLike {
  return (err as ErrorLike).message != null && (err as ErrorLike).stack !== null;
}
