import type { BettererError } from './error';

/**
 * @public An additional piece of information attached to a {@link BettererError | `BettererError`}.
 * This might be a more detailed error message, or the original Error that caused the
 * {@link BettererError | `BettererError`} to be  created.
 */
export type BettererErrorDetail = string | Error | BettererError;

/**
 * @public A list of {@link BettererErrorDetail | `BettererErrorDetail`s }.
 */
export type BettererErrorDetails = ReadonlyArray<BettererErrorDetail>;
