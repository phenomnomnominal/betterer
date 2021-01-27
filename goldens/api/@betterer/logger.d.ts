export declare class BettererConsoleLogger implements BettererLogger {
    debug: BettererLogMessage;
    error: BettererLogMessage;
    info: BettererLogMessage;
    success: BettererLogMessage;
    warn: BettererLogMessage;
    constructor();
    code(codeInfo: BettererLoggerCodeInfo): void;
}

export declare type BettererLogCode = (codeInfo: BettererLoggerCodeInfo) => void;

export declare type BettererLogCodeAsync = (codeInfo: BettererLoggerCodeInfo) => Promise<void>;

export declare type BettererLogger = {
    code: BettererLogCode;
    debug: BettererLogMessage;
    error: BettererLogMessage;
    info: BettererLogMessage;
    success: BettererLogMessage;
    warn: BettererLogMessage;
};

export declare type BettererLoggerAsync = {
    code: BettererLogCodeAsync;
    debug: BettererLogMessageAsync;
    error: BettererLogMessageAsync;
    info: BettererLogMessageAsync;
    success: BettererLogMessageAsync;
    warn: BettererLogMessageAsync;
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

export declare type BettererLogMessage = (...messages: BettererLoggerMessages) => void;

export declare type BettererLogMessageAsync = (...messages: BettererLoggerMessages) => Promise<void>;

export declare const BettererLogo: FC;

export declare const BettererTask: FC<BettererTaskProps>;

export declare type BettererTaskColour = typeof ForegroundColor;

export declare type BettererTaskContext = {
    name: string;
    run: (logger: BettererTaskLogger) => Promise<BettererTaskLog | string | void>;
};

export declare type BettererTaskError = Error & {
    details: string;
    message: string;
};

export declare type BettererTaskLog = [indicator: string, colour: BettererTaskColour, message: string];

export declare type BettererTaskLogger = BettererLogger & {
    progress: BettererTaskStatusUpdate;
};

export declare type BettererTaskLoggerAsync = BettererLoggerAsync & {
    progress: BettererTaskStatusUpdateAsync;
};

export declare type BettererTaskLogs = ReadonlyArray<BettererTaskLog>;

export declare type BettererTaskProps = {
    context: BettererTaskContext;
};

export declare const BettererTasks: FC<BettererTasksProps>;

export declare type BettererTasksProps = {
    name: string;
    statusMessage: (state: BettererTasksState) => string;
};

export declare type BettererTasksState = {
    running: number;
    done: number;
    errors: number;
    startTime: number;
    shouldExit: boolean;
};

export declare type BettererTaskStatusUpdate = (status: string) => void;

export declare type BettererTaskStatusUpdateAsync = (status: string) => Promise<void>;

export declare function codeΔ(codeInfo: BettererLoggerCodeInfo): string;

export declare function diffΔ<T>(expected: T, result: T): string | null;

export declare const LOGO = "\n   \\ | /     _         _   _                     \n '-.ooo.-'  | |__  ___| |_| |_ ___ _ __ ___ _ __ \n---ooooo--- | '_ \\/ _ \\ __| __/ _ \\ '__/ _ \\ '__|\n .-'ooo'-.  | |_)|  __/ |_| ||  __/ | |  __/ |   \n   / | \\    |_.__/\\___|\\__|\\__\\___|_|  \\___|_|   \n ";
