export declare function betterer(partialConfig?: BettererStartConfigPartial): Promise<BettererSummary>;
export declare namespace betterer {
    var file: typeof import("./betterer").file;
    var watch: typeof import("./betterer").watch;
}

export declare type BettererBaseConfigPartial = Partial<{
    configPaths: BettererConfigPaths | string;
    cwd: string;
    filters: ReadonlyArray<string | RegExp> | string;
    reporters: BettererReporterNames;
    resultsPath: string;
    silent: boolean;
    tsconfigPath: string;
}>;

export declare type BettererConfig = {
    allowDiff: boolean;
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

export declare type BettererConfigPaths = ReadonlyArray<string>;

export declare type BettererContext = {
    readonly config: BettererConfig;
};

export declare type BettererDeserialise<DeserialisedType, SerialisedType = DeserialisedType> = (serialised: SerialisedType) => DeserialisedType;

export declare type BettererDiff<DeserialisedType = unknown, DiffType = unknown> = {
    expected: DeserialisedType;
    result: DeserialisedType;
    diff: DiffType;
    log: () => void;
};

export declare type BettererDiffer<DeserialisedType, DiffType> = (expected: DeserialisedType, result: DeserialisedType) => DiffType;

export declare type BettererFile = BettererFileBase & {
    addIssue(start: number, end: number, message: string, hash?: string): void;
    addIssue(line: number, col: number, length: number, message: string, hash?: string): void;
    addIssue(startLine: number, startCol: number, endLine: number, endCol: number, message: string, hash?: string): void;
};

export declare type BettererFileBase = {
    readonly absolutePath: string;
    readonly hash: string;
    readonly issues: BettererFileIssues;
    readonly key: string;
};

export declare type BettererFileDiff = {
    fixed?: BettererFileIssues;
    existing?: BettererFileIssues;
    new?: BettererFileIssues;
};

export declare type BettererFileGlobs = ReadonlyArray<string | ReadonlyArray<string>>;

export declare type BettererFileIssue = {
    readonly line: number;
    readonly column: number;
    readonly length: number;
    readonly message: string;
    readonly hash: string;
};

export declare type BettererFileIssues = ReadonlyArray<BettererFileIssue>;

export declare type BettererFilePaths = ReadonlyArray<string>;

export declare type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;

export declare class BettererFileResolver {
    get cwd(): string;
    constructor(depth?: number);
    excludeΔ(...excludePatterns: BettererFilePatterns): this;
    files(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
    includeΔ(...includePatterns: BettererFileGlobs): this;
    resolve(...pathSegments: Array<string>): string;
    validate(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
}

export declare type BettererFilesDiff = Record<string, BettererFileDiff>;

export declare class BettererFileTest extends BettererTestState {
    readonly isBettererFileTest = "isBettererFileTest";
    constructor(_resolver: BettererFileResolver, fileTest: BettererFileTestFunction);
    exclude(...excludePatterns: BettererFilePatterns): this;
    include(...includePatterns: BettererFileGlobs): this;
}

export declare type BettererFileTestDiff = BettererDiff<BettererFileTestResult, BettererFilesDiff>;

export declare type BettererFileTestFunction = (filePaths: BettererFilePaths, fileTestResult: BettererFileTestResult) => MaybeAsync<void>;

export declare type BettererFileTestResult = {
    addFile(absolutePath: string, fileText: string): BettererFile;
    getIssues(absolutePath: string): BettererFileIssues;
};

export declare type BettererPrinter<SerialisedType> = (serialised: SerialisedType) => MaybeAsync<string>;

export declare type BettererReporter = {
    contextStart?(context: BettererContext): Promise<void> | void;
    contextEnd?(context: BettererContext, summary: BettererSummary): Promise<void> | void;
    contextError?(context: BettererContext, error: BettererError): Promise<void> | void;
    runsStart?(runs: BettererRuns, files: BettererFilePaths): Promise<void> | void;
    runsEnd?(runs: BettererRuns, files: BettererFilePaths): Promise<void> | void;
    runStart?(run: BettererRun): Promise<void> | void;
    runEnd?(run: BettererRun): Promise<void> | void;
    runError?(run: BettererRun, error: BettererError): Promise<void> | void;
};

export declare type BettererReporterNames = ReadonlyArray<string>;

export declare type BettererResult = {
    isNew: boolean;
    value: unknown;
};

export declare type BettererRun = {
    readonly diff: BettererDiff;
    readonly expected: BettererResult;
    readonly filePaths: BettererFilePaths;
    readonly name: string;
    readonly result: BettererResult;
    readonly test: BettererTestConfig;
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
};

export declare type BettererRunNames = Array<string>;

export declare type BettererRuns = ReadonlyArray<BettererRun>;

export declare type BettererSerialise<DeserialisedType, SerialisedType = DeserialisedType> = (result: DeserialisedType) => SerialisedType;

export declare type BettererSerialiser<DeserialisedType, SerialisedType = DeserialisedType> = {
    serialise: BettererSerialise<DeserialisedType, SerialisedType>;
    deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};

export declare type BettererStartConfigPartial = BettererBaseConfigPartial & Partial<{
    allowDiff: boolean;
    update: boolean;
}>;

export declare type BettererSummary = {
    readonly runs: BettererRuns;
    readonly obsolete: BettererRunNames;
    readonly result: string;
    readonly expected: string | null;
    readonly hasDiff: boolean;
    readonly better: BettererRuns;
    readonly completed: BettererRuns;
    readonly expired: BettererRuns;
    readonly failed: BettererRuns;
    readonly new: BettererRuns;
    readonly ran: BettererRuns;
    readonly same: BettererRuns;
    readonly skipped: BettererRuns;
    readonly updated: BettererRuns;
    readonly worse: BettererRuns;
};

export declare class BettererTest<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = unknown> extends BettererTestState {
    constructor(config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>);
}

export declare type BettererTestConfig<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = unknown> = {
    constraint: BettererTestConstraint<DeserialisedType>;
    deadline: number;
    goal: BettererTestGoal<DeserialisedType>;
    test: BettererTestFunction<DeserialisedType>;
    differ?: BettererDiffer<DeserialisedType, DiffType>;
    printer?: BettererPrinter<SerialisedType>;
    serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;
};

export declare type BettererTestConfigPartial<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = unknown> = {
    constraint: BettererTestConstraint<DeserialisedType>;
    deadline?: Date | string;
    goal?: DeserialisedType | BettererTestGoal<DeserialisedType>;
    test: BettererTestFunction<DeserialisedType>;
    differ?: BettererDiffer<DeserialisedType, DiffType>;
    printer?: BettererPrinter<SerialisedType>;
    serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;
};

export declare type BettererTestConstraint<DeserialisedType> = (result: DeserialisedType, expected: DeserialisedType) => MaybeAsync<BettererConstraintResult>;

export declare type BettererTestFunction<DeserialisedType> = (run: BettererRun) => MaybeAsync<DeserialisedType>;

export declare type BettererTestGoal<DeserialisedType> = (result: DeserialisedType) => MaybeAsync<boolean>;

export declare class BettererTestState {
    get config(): BettererTestConfig;
    readonly isBettererTest = "isBettererTest";
    get isOnly(): boolean;
    get isSkipped(): boolean;
    constructor(_config: BettererTestConfig);
    only(): this;
    skip(): this;
}

export declare type BettererWatchConfigPartial = BettererBaseConfigPartial & Partial<{
    ignores: BettererConfigIgnore;
}>;

export declare type BettererWatcher = {
    stop(): Promise<void>;
    onRun(handler: BettererWatchRunHandler): void;
};

export declare type BettererWatchRunHandler = (summary: BettererSummary) => void;

export declare function file(filePath: string, partialConfig?: BettererBaseConfigPartial): Promise<BettererSummary>;

export declare function watch(partialConfig?: BettererWatchConfigPartial): Promise<BettererWatcher>;
