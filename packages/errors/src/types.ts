export type BettererError = Error & {
  code: symbol;
  details: BettererErrorDetails;
};

export type BettererErrorDetails = ReadonlyArray<string | Error | BettererError>;
export type BettererErrorFactory = (...details: BettererErrorDetails) => BettererError;
export type BettererErrorMessageFactory = (...details: BettererErrorDetails) => string;

export type ErrorLike = {
  message: string;
  stack: string;
};
