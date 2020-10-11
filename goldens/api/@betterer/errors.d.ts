export declare type BettererError = Error & {
    code: symbol;
    details: BettererErrorDetails;
};

export declare type BettererErrorDetail = string | ErrorLike | BettererError;

export declare type BettererErrorDetails = ReadonlyArray<BettererErrorDetail>;

export declare type BettererErrorFactory = (...details: BettererErrorDetails) => BettererError;

export declare type BettererErrorMessageFactory = (...details: BettererErrorDetails) => string;

export declare type ErrorLike = {
    message: string;
    stack: string;
};

export declare function logErrorΔ(err: ErrorLike | Error | BettererError): void;

export declare function registerError(messageFactory: BettererErrorMessageFactory): BettererErrorFactory;
