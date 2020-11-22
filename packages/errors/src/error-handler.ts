import { BettererConsoleLogger } from '@betterer/logger';

import { BettererError, isBettererError } from './error';

const logger = new BettererConsoleLogger();

export function logErrorΔ(err: Error | BettererError): void {
  if (isBettererError(err)) {
    const errors = err.details.filter((detail) => isError(detail)) as Array<Error>;
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

function isError(err: unknown): err is Error {
  return (err as Error).message != null && (err as Error).stack !== null;
}
