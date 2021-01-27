export declare class BettererError extends Error {
    details: BettererErrorDetails;
    isBettererError: boolean;
    constructor(message: string, ...details: BettererErrorDetails);
}

export declare type BettererErrorDetail = string | Error | BettererError;

export declare type BettererErrorDetails = ReadonlyArray<BettererErrorDetail>;

export declare function isBettererError(err: unknown): err is BettererError;
