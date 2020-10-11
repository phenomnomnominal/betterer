export type BettererError = Error & {
  code: symbol;
  details: BettererErrorDetails;
};

export type BettererErrorDetail = string | ErrorLike | BettererError;
export type BettererErrorDetails = ReadonlyArray<BettererErrorDetail>;
export type BettererErrorFactory = (...details: BettererErrorDetails) => BettererError;
export type BettererErrorMessageFactory = (...details: BettererErrorDetails) => string;

export type ErrorLike = {
  message: string;
  stack: string;
};
