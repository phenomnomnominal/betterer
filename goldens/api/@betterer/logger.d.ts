export declare type BettererLogCode = (codeInfo: BettererLoggerCodeInfo) => Promise<void>;

export declare type BettererLogger = {
    code: BettererLogCode;
    debug: BettererLogMessage;
    error: BettererLogMessage;
    info: BettererLogMessage;
    progress: BettererLogMessage;
    success: BettererLogMessage;
    warn: BettererLogMessage;
};

export declare type BettererLoggerCodeInfo = {
    message: string;
    filePath: string;
    fileText: string;
    line: number;
    column: number;
    length: number;
};

export declare type BettererLoggerMessages = Array<string>;

export declare type BettererLogMessage = (...messages: BettererLoggerMessages) => Promise<void>;

export declare function codeΔ(codeInfo: BettererLoggerCodeInfo): string;

export declare function diffΔ<T>(expected: T, result: T): string | null;
