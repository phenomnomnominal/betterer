import { BettererErrorDetails, ErrorLike } from './types';

const ERRORS: Array<BettererError> = [];

export class BettererError extends Error {
  public details: BettererErrorDetails;

  constructor(message: string, ...details: BettererErrorDetails) {
    super(message);

    Error.captureStackTrace(this, BettererError);
    Object.setPrototypeOf(this, new.target.prototype);

    this.details = details;
    ERRORS.push(this);
  }
}

export function isBettererError(err: ErrorLike | Error | BettererError): err is BettererError {
  return !!ERRORS.includes(err as BettererError);
}
