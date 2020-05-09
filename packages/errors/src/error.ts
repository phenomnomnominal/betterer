import { BettererErrorDetails } from './types';

export class BettererError extends Error {
  public details: BettererErrorDetails;

  constructor(public code: symbol, ...details: BettererErrorDetails) {
    super();

    Error.captureStackTrace(this, BettererError);
    Object.setPrototypeOf(this, new.target.prototype);

    this.details = details;
  }
}
