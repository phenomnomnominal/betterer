export declare const BettererErrorLog: FC<BettererErrorLogProps>;

export declare type BettererErrorLogProps = {
    error: Error | BettererError;
};

export declare type BettererLogCode = (codeInfo: BettererLoggerCodeInfo) => Promise<void>;

export declare type BettererLogger = {
    code: BettererLogCode;
    debug: BettererLogMessage;
    error: BettererLogMessage;
    info: BettererLogMessage;
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

export declare const BettererLogo: FC;

export declare const BettererTask: FC<BettererTaskProps>;

export declare type BettererTaskColour = typeof ForegroundColor;

export declare type BettererTaskContext = {
    name: string;
    run: (logger: BettererTaskLogger) => Promise<BettererTaskLog | string | void>;
};

export declare type BettererTaskLog = [indicator: string, colour: BettererTaskColour, message: string];

export declare type BettererTaskLogger = BettererLogger & {
    progress: BettererTaskStatusUpdate;
};

export declare type BettererTaskLogs = ReadonlyArray<BettererTaskLog>;

export declare type BettererTaskProps = {
    context: BettererTaskContext;
};

export declare const BettererTasks: FC<BettererTasksProps>;

export declare type BettererTasksProps = {
    name: string;
    statusMessage: (state: BettererTasksState) => string;
    exit?: boolean;
};

export declare type BettererTasksState = {
    running: number;
    done: number;
    errors: number;
    startTime: number;
    shouldExit: boolean;
};

export declare type BettererTaskStatusUpdate = (status: string) => Promise<void>;

export declare function diffΔ<T>(expected: T, result: T): string | null;
