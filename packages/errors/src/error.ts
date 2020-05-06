import { ErrorDetails } from './types';

export class BettererError extends Error {
  public details: ErrorDetails;

  constructor(public code: symbol, ...details: ErrorDetails) {
    super();

    this.details = details;
  }
}
