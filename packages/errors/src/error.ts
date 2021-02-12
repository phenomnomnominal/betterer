import { BettererErrorDetails } from './types';

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

export function isBettererError(err: unknown): err is BettererError {
  return !!(err as BettererError).isBettererError;
}
