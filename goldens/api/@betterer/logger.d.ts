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

export declare function BettererLoggerTask<T>(props: BettererLoggerTaskProps<T>): ReturnType<FC<BettererLoggerTaskProps<T>>>;

export declare type BettererLoggerTaskColour = string;

export declare type BettererLoggerTaskContext<TaskStatesEnum> = {
    name: string;
    run: () => Promise<BettererLoggerTaskState<TaskStatesEnum>>;
    getStatus: BettererLoggerTaskGetStatus<TaskStatesEnum>;
};

export declare type BettererLoggerTaskGetStatus<TaskStatesEnum> = (taskName: string, state: TaskStatesEnum, data?: string | null) => BettererLoggerTaskStatus;

export declare type BettererLoggerTaskProps<StatesEnum> = {
    context: BettererLoggerTaskContext<StatesEnum>;
};

export declare type BettererLoggerTaskState<State> = {
    value: State;
    data: string | null;
};

export declare type BettererLoggerTaskStatus = [indicator: string, colour: BettererLoggerTaskColour, message: string];

export declare function brΔ(): void;

export declare function codeΔ(codeInfo: BettererLoggerCodeInfo): void;

export declare const debugΔ: BettererLogger;

export declare function diffΔ(expected: unknown, result: unknown, options?: DiffOptions): void;

export declare const errorΔ: BettererLogger;

export declare function getTaskState<State>(value: State, data?: string): BettererLoggerTaskState<State>;

export declare const infoΔ: BettererLogger;

export declare function logoΔ(): void;

export declare function muteΔ(): void;

export declare function overwriteΔ(content: string): BettererLoggerOverwriteDone;

export declare const successΔ: BettererLogger;

export declare function unmuteΔ(): void;

export declare const warnΔ: BettererLogger;
