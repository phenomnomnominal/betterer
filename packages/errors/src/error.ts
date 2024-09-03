import type { BettererErrorDetails } from './types.js';

/**
 * @public A custom Error for use in **Betterer**. It attaches some extra details to a standard
 * JavaScript error for better logging and debugging.
 *
 * @param message - The error message.
 * @param details - Extra details for the error.
 */
export class BettererError extends Error {
  /**
   * Extra details for the error.
   */
  public details: BettererErrorDetails;
  /**
   * Used by {@link @betterer/errors#isBettererError | `isBettererError()`} to detect that an
   * object is an instance of `BettererError`.
   */
  public isBettererError = true;

  constructor(message: string, ...details: BettererErrorDetails) {
    super(message);

    Error.captureStackTrace(this, BettererError);
    Object.setPrototypeOf(this, new.target.prototype);

    this.details = details;
  }
}

/**
 * @public Check if an object is a {@link BettererError | `BettererError`}.
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
  return !!err && !!(err as Partial<BettererError>).isBettererError;
}
