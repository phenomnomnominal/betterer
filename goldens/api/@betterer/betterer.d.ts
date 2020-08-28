export declare function betterer(partialConfig?: BettererConfigPartial): Promise<BettererSummary>;
export declare namespace betterer {
    var file: typeof import("./betterer").file;
    var watch: typeof import("./betterer").watch;
}

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

export declare type BettererConfigPartial = Partial<{
    allowDiff: boolean;
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
};

export declare type BettererDeserialise<DeserialisedType, SerialisedType = DeserialisedType> = (serialised: SerialisedType) => DeserialisedType;

export declare type BettererDiff<DeserialisedType = unknown, DiffType = unknown> = {
    expected: DeserialisedType;
    result: DeserialisedType;
    diff: DiffType;
    log: () => void;
};

export declare type BettererDiffer<DeserialisedType, DiffType> = (expected: DeserialisedType, result: DeserialisedType) => DiffType;

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

export declare type BettererFilesDiff = Record<string, {
    fixed?: ReadonlyArray<BettererFileIssueDeserialised>;
    existing?: ReadonlyArray<BettererFileIssueDeserialised>;
    neww?: ReadonlyArray<BettererFileIssueRaw>;
}>;

export declare class BettererFileTest extends BettererTest<BettererFiles, BettererFileIssuesMapSerialised, BettererFileTestDiff> {
    isBettererFileTest: string;
    constructor(_resolver: BettererFileResolver, fileTest: BettererFileTestFunction);
    exclude(...excludePatterns: BettererFilePatterns): this;
    include(...includePatterns: BettererFileGlobs): this;
}

export declare type BettererFileTestDiff = BettererDiff<BettererFiles, BettererFilesDiff>;

export declare type BettererFileTestFunction = (files: BettererFilePaths) => MaybeAsync<BettererFileIssuesMapRaw>;

export declare type BettererPrinter<SerialisedType> = (serialised: SerialisedType) => MaybeAsync<string>;

export declare type BettererReporter = {
    contextStart?(context: BettererContext): void;
    contextEnd?(context: BettererContext, summary: BettererSummary): void;
    contextError?(context: BettererContext, error: BettererError): void;
    runsStart?(runs: BettererRuns, files: BettererFilePaths): void;
    runsEnd?(runs: BettererRuns, files: BettererFilePaths): void;
    runStart?(run: BettererRun): void;
    runEnd?(run: BettererRun): void;
};

export declare type BettererReporterNames = ReadonlyArray<string>;

export declare type BettererResult = {
    isNew: boolean;
    value: unknown;
};

export declare type BettererRun = {
    readonly diff: BettererDiff;
    readonly expected: BettererResult;
    readonly files: BettererFilePaths;
    readonly name: string;
    readonly result: BettererResult;
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
};

export declare type BettererRunNames = Array<string>;

export declare type BettererRuns = ReadonlyArray<BettererRun>;

export declare type BettererSerialise<DeserialisedType, SerialisedType = DeserialisedType> = (result: DeserialisedType) => SerialisedType;

export declare type BettererSerialiser<DeserialisedType, SerialisedType = DeserialisedType> = {
    serialise: BettererSerialise<DeserialisedType, SerialisedType>;
    deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};

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
    readonly constraint: BettererTestConstraint<DeserialisedType>;
    readonly deadline: number;
    readonly differ?: BettererDiffer<DeserialisedType, DiffType>;
    readonly goal: BettererTestGoal<DeserialisedType>;
    readonly isBettererTest = "isBettererTest";
    readonly printer?: BettererPrinter<SerialisedType>;
    readonly serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;
    readonly test: BettererTestFunction<DeserialisedType>;
    constructor(options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>);
}

export declare type BettererTestConstraint<DeserialisedType> = (result: DeserialisedType, expected: DeserialisedType) => MaybeAsync<BettererConstraintResult>;

export declare type BettererTestFunction<DeserialisedType> = (run: BettererRun) => MaybeAsync<DeserialisedType>;

export declare type BettererTestGoal<DeserialisedType> = (result: DeserialisedType) => MaybeAsync<boolean>;

export declare type BettererTestOptions<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = unknown> = {
    constraint: BettererTestConstraint<DeserialisedType>;
    deadline?: Date | string;
    goal?: DeserialisedType | BettererTestGoal<DeserialisedType>;
    test: BettererTestFunction<DeserialisedType>;
    differ?: BettererDiffer<DeserialisedType, DiffType>;
    printer?: BettererPrinter<SerialisedType>;
    serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;
} & BettererTestStateOptions;

export declare type BettererWatcher = {
    stop(): Promise<void>;
    onRun(handler: BettererWatchRunHandler): void;
};

export declare type BettererWatchRunHandler = (summary: BettererSummary) => void;

export declare function config(partialConfig: BettererConfigPartial): void;

export declare function file(filePath: string, partialConfig?: BettererConfigPartial): Promise<BettererSummary>;

export declare function watch(partialConfig?: BettererConfigPartial): Promise<BettererWatcher>;
