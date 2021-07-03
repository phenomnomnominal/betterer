export declare type BettererLog = {
    code?: BettererLoggerCodeInfo;
    debug?: BettererLoggerMessage;
    error?: BettererLoggerMessage;
    info?: BettererLoggerMessage;
    progress?: BettererLoggerMessage;
    success?: BettererLoggerMessage;
    warn?: BettererLoggerMessage;
};

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

export declare type BettererLoggerMessage = string;

export declare type BettererLoggerMessages = Array<BettererLoggerMessage>;

export declare type BettererLogMessage = (...messages: BettererLoggerMessages) => Promise<void>;

export declare type BettererLogs = Array<BettererLog>;

export declare function codeΔ(codeInfo: BettererLoggerCodeInfo): string;

export declare function diffΔ<T>(expected: T, result: T): string | null;
