export declare function betterer(partialConfig?: BettererConfigPartial): Promise<BettererStats>;
export declare namespace betterer {
    var single: typeof import("./betterer").single;
    var watch: typeof import("./betterer").watch;
}

export declare type BettererConfig = {
    configPaths: BettererConfigPaths;
    cwd: string;
    filters: BettererConfigFilters;
    ignores: BettererConfigIgnore;
    reporters: BettererReporterNames;
    resultsPath: string;
    silent: boolean;
    tsconfigPath: string | null;
    update: boolean;
};

export declare type BettererConfigFilters = ReadonlyArray<RegExp>;

export declare type BettererConfigIgnore = ReadonlyArray<string>;

export declare type BettererConfigPartial = Partial<{
    configPaths: BettererConfigPaths | string;
    cwd: string;
    filters: BettererConfigFilters | ReadonlyArray<string> | string;
    ignores: BettererConfigIgnore | string;
    reporters: BettererReporterNames;
    resultsPath: string;
    silent: boolean;
    tsconfigPath: string;
    update: boolean;
}>;

export declare type BettererConfigPaths = ReadonlyArray<string>;

export declare type BettererContext = {
    readonly config: BettererConfig;
    getAbsolutePathΔ(path: string): string;
    getRelativePathΔ(path: string): string;
};

export declare type BettererDeserialise<DeserialisedType, SerialisedType = DeserialisedType> = (run: BettererRun, serialised: SerialisedType) => DeserialisedType;

export declare type BettererDiffer = (run: BettererRun) => void;

export declare type BettererFileGlobs = ReadonlyArray<string | ReadonlyArray<string>>;

export declare type BettererFileIssueDeserialised = {
    readonly line: number;
    readonly column: number;
    readonly length: number;
    readonly message: string;
    readonly hash: string;
};

export declare type BettererFileIssueRaw = BettererLoggerCodeInfo & {
    hash?: string;
};

export declare type BettererFileIssues = ReadonlyArray<BettererFileIssueRaw> | ReadonlyArray<BettererFileIssueDeserialised>;

export declare type BettererFileIssueSerialised = [number, number, number, string, string];

export declare type BettererFileIssuesMapRaw = Record<string, BettererFileIssuesRaw>;

export declare type BettererFileIssuesMapSerialised = Record<string, BettererFileIssuesSerialised>;

export declare type BettererFileIssuesRaw = ReadonlyArray<BettererFileIssueRaw>;

export declare type BettererFileIssuesSerialised = ReadonlyArray<BettererFileIssueSerialised>;

export declare type BettererFilePaths = ReadonlyArray<string>;

export declare type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;

export declare class BettererFileResolver {
    get cwd(): string;
    constructor(depth?: number);
    excludeΔ(...excludePatterns: BettererFilePatterns): this;
    filesΔ(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
    forceRelativePaths(message: string): string;
    includeΔ(...includePatterns: BettererFileGlobs): this;
    resolve(...pathSegments: Array<string>): string;
    validate(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
}

export declare type BettererFiles = {
    readonly filesΔ: ReadonlyArray<BettererFile>;
    getFileΔ(absolutePath: string): BettererFile | void;
};

export declare class BettererFileTest extends BettererTest<BettererFiles, BettererFileIssuesMapSerialised> {
    get diff(): BettererFileTestDiff | null;
    isBettererFileTest: string;
    constructor(_resolver: BettererFileResolver, fileTest: BettererFileTestFunction);
    exclude(...excludePatterns: BettererFilePatterns): this;
    include(...includePatterns: BettererFileGlobs): this;
}

export declare type BettererFileTestDiff = Record<string, {
    fixed?: ReadonlyArray<BettererFileIssueDeserialised>;
    existing?: ReadonlyArray<BettererFileIssueDeserialised>;
    neww?: ReadonlyArray<BettererFileIssueRaw>;
}>;

export declare type BettererFileTestFunction = (files: BettererFilePaths) => MaybeAsync<BettererFileIssuesMapRaw>;

export declare type BettererPrinter<SerialisedType> = (run: BettererRun, serialised: SerialisedType) => MaybeAsync<string>;

export declare type BettererReporter = {
    contextStart?(context: BettererContext): void;
    contextEnd?(context: BettererContext, stats: BettererStats): void;
    contextError?(context: BettererContext, error: BettererError, printed: Array<string>): void;
    runsStart?(runs: BettererRuns, files: BettererFilePaths): void;
    runsEnd?(runs: BettererRuns, files: BettererFilePaths): void;
    runStart?(run: BettererRun): void;
    runEnd?(run: BettererRun): void;
};

export declare type BettererReporterNames = ReadonlyArray<string>;

export declare type BettererRun = {
    readonly context: BettererContext;
    readonly expected: unknown | typeof NO_PREVIOUS_RESULT;
    readonly files: BettererFilePaths;
    readonly result: unknown;
    readonly shouldPrint: boolean;
    readonly test: BettererTest;
    readonly timestamp: number;
    readonly isBetter: boolean;
    readonly isComplete: boolean;
    readonly isExpired: boolean;
    readonly isFailed: boolean;
    readonly isNew: boolean;
    readonly isSame: boolean;
    readonly isSkipped: boolean;
    readonly isUpdated: boolean;
    readonly isWorse: boolean;
    diff(): void;
};

export declare type BettererRuns = ReadonlyArray<BettererRun>;

export declare type BettererSerialise<DeserialisedType, SerialisedType = DeserialisedType> = (run: BettererRun, result: DeserialisedType) => SerialisedType;

export declare type BettererSerialiser<DeserialisedType, SerialisedType = DeserialisedType> = {
    serialise: BettererSerialise<DeserialisedType, SerialisedType>;
    deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};

export declare type BettererStats = {
    readonly better: BettererTestNames;
    readonly completed: BettererTestNames;
    readonly expired: BettererTestNames;
    readonly failed: BettererTestNames;
    readonly new: BettererTestNames;
    readonly ran: BettererTestNames;
    readonly same: BettererTestNames;
    readonly obsolete: BettererTestNames;
    readonly skipped: BettererTestNames;
    readonly updated: BettererTestNames;
    readonly worse: BettererTestNames;
};

export declare class BettererTest<DeserialisedType = unknown, SerialisedType = DeserialisedType> extends BettererTestState {
    readonly constraint: BettererTestConstraint<DeserialisedType>;
    readonly deadline: number;
    differ?: BettererDiffer;
    readonly goal: BettererTestGoal<DeserialisedType>;
    isBettererTest: string;
    get name(): string;
    printer?: BettererPrinter<SerialisedType>;
    serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;
    readonly test: BettererTestFunction<DeserialisedType>;
    constructor(options: BettererTestOptions<DeserialisedType, SerialisedType>);
    setName(name: string): void;
}

export declare type BettererTestConstraint<DeserialisedType> = (result: DeserialisedType, expected: DeserialisedType) => MaybeAsync<BettererConstraintResult>;

export declare type BettererTestFunction<DeserialisedType> = (run: BettererRun) => MaybeAsync<DeserialisedType>;

export declare type BettererTestGoal<DeserialisedType> = (result: DeserialisedType) => MaybeAsync<boolean>;

export declare type BettererTestNames = Array<string>;

export declare type BettererTestOptions<DeserialisedType, SerialisedType = DeserialisedType> = {
    constraint: BettererTestConstraint<DeserialisedType>;
    deadline?: Date | string;
    goal?: DeserialisedType | BettererTestGoal<DeserialisedType>;
    test: BettererTestFunction<DeserialisedType>;
    differ?: BettererDiffer;
    printer?: BettererPrinter<SerialisedType>;
    serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;
} & BettererTestStateOptions;

export declare type BettererWatcher = {
    stop(): Promise<void>;
    onRun(handler: BettererWatchRunHandler): void;
};

export declare type BettererWatchRunHandler = (runs: BettererRuns) => void;

export declare function config(partialConfig: BettererConfigPartial): void;
