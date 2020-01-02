export class BettererError extends Error {
  public details: Array<unknown>;

  constructor(public code: symbol, ...details: Array<unknown>) {
    super();

    this.details = details;
  }
}
