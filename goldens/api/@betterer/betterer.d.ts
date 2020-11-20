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
    ignores: BettererConfigIgnores;
    reporters: BettererReporterNames;
    resultsPath: string;
    silent: boolean;
    tsconfigPath: string | null;
    update: boolean;
};

export declare type BettererConfigFilters = ReadonlyArray<RegExp>;

export declare type BettererConfigIgnores = ReadonlyArray<string>;

export declare type BettererConfigPartial = BettererBaseConfigPartial & BettererStartConfigPartial & BettererWatchConfigPartial;

export declare type BettererConfigPaths = ReadonlyArray<string>;

export declare type BettererContext = {
    readonly config: BettererConfig;
    readonly lifecycle: Promise<BettererSummary>;
};

export declare type BettererDeserialise<DeserialisedType extends BettererResultValue, SerialisedType> = (serialised: SerialisedType) => DeserialisedType;

export declare type BettererDiff<DeserialisedType extends BettererResultValue = BettererResultValue, DiffType = null> = {
    expected: DeserialisedType;
    result: DeserialisedType;
    diff: DiffType;
    log: (logger: BettererLogger) => void;
};

export declare type BettererDiffer<DeserialisedType extends BettererResultValue, DiffType> = (expected: DeserialisedType, result: DeserialisedType) => BettererDiff<DeserialisedType, DiffType>;

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

export declare class BettererFileTest implements BettererTestBase<BettererFileTestResult, BettererFileIssuesMapSerialised, BettererFilesDiff> {
    get config(): BettererTestConfig<BettererFileTestResult, BettererFileIssuesMapSerialised, BettererFilesDiff>;
    readonly isBettererFileTest = "isBettererFileTest";
    readonly isBettererTest = "isBettererTest";
    get isOnly(): boolean;
    get isSkipped(): boolean;
    constructor(_resolver: BettererFileResolver, fileTest: BettererFileTestFunction);
    exclude(...excludePatterns: BettererFilePatterns): this;
    include(...includePatterns: BettererFileGlobs): this;
    only(): this;
    skip(): this;
}

export declare type BettererFileTestDiff = BettererDiff<BettererFileTestResult, BettererFilesDiff>;

export declare type BettererFileTestFunction = (filePaths: BettererFilePaths, fileTestResult: BettererFileTestResult) => MaybeAsync<void>;

export declare type BettererFileTestResult = BettererResultValueComplex & {
    addFile(absolutePath: string, fileText: string): BettererFile;
    getIssues(absolutePath: string): BettererFileIssues;
};

export declare type BettererPrinter<SerialisedType> = (serialised: SerialisedType) => MaybeAsync<string>;

export declare type BettererReporter = {
    configError?(config: BettererConfigPartial, error: BettererError): Promise<void> | void;
    contextStart?(context: BettererContext, lifecycle: Promise<BettererSummary>): Promise<void> | void;
    contextEnd?(context: BettererContext, summary: BettererSummary): Promise<void> | void;
    contextError?(context: BettererContext, error: BettererError): Promise<void> | void;
    runsStart?(runs: BettererRuns, files: BettererFilePaths): Promise<void> | void;
    runsEnd?(runs: BettererRuns, files: BettererFilePaths): Promise<void> | void;
    runStart?(run: BettererRun, lifecycle: Promise<void>): Promise<void> | void;
    runEnd?(run: BettererRun): Promise<void> | void;
    runError?(run: BettererRun, error: BettererError): Promise<void> | void;
};

export declare type BettererReporterNames = ReadonlyArray<string>;

export declare type BettererResult = {
    isNew: boolean;
    value: unknown;
    result: BettererResultValue;
};

export declare type BettererResultValue = BettererResultValueBasic | BettererResultValueComplex;

export declare type BettererResultValueBasic = number;

export declare type BettererResultValueComplex = {
    value: number;
};

export declare type BettererRun = {
    readonly diff: BettererDiff;
    readonly expected: BettererResult;
    readonly filePaths: BettererFilePaths;
    readonly lifecycle: Promise<void>;
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

export declare type BettererSerialise<DeserialisedType extends BettererResultValue, SerialisedType> = (result: DeserialisedType) => SerialisedType;

export declare type BettererSerialiser<DeserialisedType extends BettererResultValue, SerialisedType = DeserialisedType> = {
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

export declare class BettererTest<DeserialisedType extends BettererResultValue, SerialisedType, DiffType> implements BettererTestBase<DeserialisedType, SerialisedType, DiffType> {
    get config(): BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
    readonly isBettererTest = "isBettererTest";
    get isOnly(): boolean;
    get isSkipped(): boolean;
    constructor(config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>);
    only(): this;
    skip(): this;
}

export declare type BettererTestConfig<DeserialisedType extends BettererResultValue = BettererResultValue, SerialisedType = DeserialisedType, DiffType = null> = {
    constraint: BettererTestConstraint<DeserialisedType>;
    deadline: number;
    goal: BettererTestGoal<DeserialisedType>;
    test: BettererTestFunction<DeserialisedType>;
    differ: BettererDiffer<DeserialisedType, DiffType>;
    printer: BettererPrinter<SerialisedType>;
    serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
};

export declare type BettererTestConstraint<DeserialisedType extends BettererResultValue> = (result: DeserialisedType, expected: DeserialisedType) => MaybeAsync<BettererConstraintResult>;

export declare type BettererTestFunction<DeserialisedType extends BettererResultValue> = (run: BettererRun) => MaybeAsync<DeserialisedType>;

export declare type BettererTestGoal<DeserialisedType extends BettererResultValue> = (result: DeserialisedType) => MaybeAsync<boolean>;

export declare type BettererWatchConfigPartial = BettererBaseConfigPartial & Partial<{
    ignores: BettererConfigIgnores;
}>;

export declare type BettererWatcher = {
    stop(): Promise<void>;
    onRun(handler: BettererWatchRunHandler): void;
};

export declare type BettererWatchRunHandler = (summary: BettererSummary) => void;

export declare function file(filePath: string, partialConfig?: BettererBaseConfigPartial): Promise<BettererSummary>;

export declare function watch(partialConfig?: BettererWatchConfigPartial): Promise<BettererWatcher>;
