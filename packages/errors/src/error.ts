import { BettererError, BettererErrorDetails } from './types';

export class BettererErrorΩ extends Error implements BettererError {
  public details: BettererErrorDetails;

  constructor(message: string, public code: symbol, ...details: BettererErrorDetails) {
    super(message);

    Error.captureStackTrace(this, BettererErrorΩ);
    Object.setPrototypeOf(this, new.target.prototype);

    this.details = details;
  }
}
