import { BettererErrorDetails } from './types';

/**
 * @public A custom Error for use in **Betterer**. It attaches some
 * extra details to a standard JavaScript error for better logging and debugging.
 */
export class BettererError extends Error {
  public details: BettererErrorDetails;
  public isBettererError = true;

  constructor(message: string, ...details: BettererErrorDetails) {
    super(message);

    Error.captureStackTrace(this, BettererError);
    Object.setPrototypeOf(this, new.target.prototype);

    this.details = details;
  }
}

/**
 * @public Check if an object is a {@link BettererError | `BettererError`}
 *
 * @example
 * ```typescript
 * import { BettererError, isBettererError } from '@betterer/errors';
 *
 * isBettererError(new Error()); // false
 * isBettererError(new BettererError()); // true
 * ```
 */
export function isBettererError(err: unknown): err is BettererError {
  return !!(err as BettererError).isBettererError;
}
