export declare type BettererLogger = (...messages: BettererLoggerMessages) => void;

export declare type BettererLoggerCodeInfo = {
    message: string;
    filePath: string;
    fileText: string;
    line: number;
    column: number;
    length: number;
};

export declare type BettererLoggerDiffOptions = DiffOptions;

export declare type BettererLoggerMessages = ReadonlyArray<string>;

export declare type BettererLoggerOverwriteDone = typeof logUpdate['done'];

export declare const BettererTask: FC<BettererTaskProps>;

export declare type BettererTaskColour = typeof ForegroundColor;

export declare type BettererTaskContext = {
    name: string;
    run: (logger: BettererTaskLogger) => Promise<BettererTaskStatusMessage | string | void>;
};

export declare type BettererTaskError = Error & {
    details: string;
    message: string;
};

export declare type BettererTaskLogger = {
    status: BettererTaskUpdate;
    debug: BettererTaskUpdate;
    info: BettererTaskUpdate;
    warn: BettererTaskUpdate;
};

export declare type BettererTaskProps = {
    context: BettererTaskContext;
};

export declare const BettererTasks: FC<BettererTasksProps>;

export declare type BettererTasksProps = {
    name: string;
};

export declare type BettererTaskStatusMessage = [indicator: string, colour: BettererTaskColour, message: string];

export declare type BettererTaskStatusMessages = ReadonlyArray<BettererTaskStatusMessage>;

export declare type BettererTaskUpdate = (status: string) => void;

export declare function brΔ(): void;

export declare function codeΔ(codeInfo: BettererLoggerCodeInfo): void;

export declare function diffΔ(expected: unknown, result: unknown, options?: DiffOptions): void;

export declare const errorΔ: BettererLogger;

export declare const infoΔ: BettererLogger;

export declare function logoΔ(): void;

export declare function muteΔ(): void;

export declare function overwriteΔ(content: string): BettererLoggerOverwriteDone;

export declare const successΔ: BettererLogger;

export declare function unmuteΔ(): void;

export declare const warnΔ: BettererLogger;
