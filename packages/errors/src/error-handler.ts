import { BettererConsoleLogger } from '@betterer/logger';

import { BettererError, isBettererError } from './error';
import { BettererErrorDetail, ErrorLike } from './types';

const logger = new BettererConsoleLogger();

export function logErrorΔ(err: ErrorLike | Error | BettererError): void {
  if (isBettererError(err)) {
    const errors = err.details.filter((detail) => isErrorLike(detail)) as Array<ErrorLike>;
    logger.error(err.message);
    errors.forEach(logErrorΔ);
    return;
  }
  /* eslint-disable no-console */
  console.log();
  console.error(err.stack);
  console.log();
  /* eslint-enable no-console */
}

function isErrorLike(err: BettererErrorDetail): err is ErrorLike {
  return (err as ErrorLike).message != null && (err as ErrorLike).stack !== null;
}
