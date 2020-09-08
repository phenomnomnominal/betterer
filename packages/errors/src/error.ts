import { BettererErrorDetails, BettererError } from './types';

export class BettererErrorΩ extends Error implements BettererError {
  public details: BettererErrorDetails;

  constructor(public code: symbol, ...details: BettererErrorDetails) {
    super();

    Error.captureStackTrace(this, BettererErrorΩ);
    Object.setPrototypeOf(this, new.target.prototype);

    this.details = details;
  }
}
