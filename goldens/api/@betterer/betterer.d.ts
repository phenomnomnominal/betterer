export declare function betterer(options?: BettererOptionsStart): Promise<BettererSuiteSummary>;
export declare namespace betterer {
    var runner: typeof import("./betterer").runner;
    var watch: typeof import("./betterer").watch;
}

export declare type BettererConfig = {
    cache: boolean;
    cachePath: string;
    configPaths: BettererConfigPaths;
    cwd: string;
    filePaths: BettererConfigPaths;
    filters: BettererConfigFilters;
    reporters: BettererConfigReporters;
    resultsPath: string;
    silent: boolean;
    tsconfigPath: string | null;
    workers: number;
    ci: boolean;
    precommit: boolean;
    strict: boolean;
    update: boolean;
    ignores: BettererConfigIgnores;
    watch: boolean;
};

export declare type BettererConfigFilters = ReadonlyArray<RegExp>;

export declare type BettererConfigIgnores = ReadonlyArray<string>;

export declare type BettererConfigPaths = ReadonlyArray<string>;

export declare type BettererConfigReporter = string | BettererReporter;

export declare type BettererConfigReporters = ReadonlyArray<BettererConfigReporter>;

export declare type BettererContext = {
    readonly config: BettererConfig;
};

export declare type BettererContextSummary = BettererContext & {
    suites: BettererSuiteSummaries;
    lastSuite: BettererSuiteSummary;
};

export declare type BettererDelta = {
    readonly baseline: number;
    readonly diff: number;
    readonly result: number;
} | {
    readonly baseline: null;
    readonly diff: 0;
    readonly result: number;
};

export declare type BettererDeserialise<DeserialisedType, SerialisedType> = (serialised: SerialisedType, resultsPath: string) => DeserialisedType;

export declare type BettererDiff<DiffType = null> = {
    diff: DiffType;
    logs: BettererLogs;
};

export declare type BettererDiffer<DeserialisedType, DiffType> = (expected: DeserialisedType, result: DeserialisedType) => BettererDiff<DiffType>;

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

export declare type BettererFilePath = string;

export declare type BettererFilePaths = ReadonlyArray<BettererFilePath>;

export declare type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;

export declare type BettererFileResolver = {
    baseDirectory: string;
    files(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
    resolve(...pathSegments: Array<string>): string;
    validate(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
};

export declare type BettererFilesDiff = Record<string, BettererFileDiff>;

export declare class BettererFileTest implements BettererFileTestBase {
    get config(): BettererFileTestConfig;
    get isOnly(): boolean;
    get isSkipped(): boolean;
    constructor(fileTest: BettererFileTestFunction);
    constraint(constraintOverride: BettererTestConstraint<BettererFileTestResult>): this;
    exclude(...excludePatterns: BettererFilePatterns): this;
    goal(goalOverride: BettererTestGoal<BettererFileTestResult>): this;
    include(...includePatterns: BettererFileGlobs): this;
    only(): this;
    skip(): this;
}

export declare type BettererFileTestDiff = BettererDiff<BettererFilesDiff>;

export declare type BettererFileTestFunction = (filePaths: BettererFilePaths, fileTestResult: BettererFileTestResult, resolver: BettererFileResolver) => MaybeAsync<void>;

export declare type BettererFileTestResult = {
    addFile(absolutePath: string, fileText: string): BettererFile;
    getFilePaths(): BettererFilePaths;
    getIssues(absolutePath?: string): BettererFileIssues;
};

export declare type BettererOptionsBase = Partial<{
    cache: boolean;
    cachePath: string;
    configPaths: BettererOptionsPaths;
    cwd: string;
    filters: BettererOptionsFilters;
    reporters: BettererConfigReporters;
    resultsPath: string;
    silent: boolean;
    tsconfigPath: string;
    workers: number;
}>;

export declare type BettererOptionsExcludes = Array<string | RegExp> | string;

export declare type BettererOptionsFilters = Array<string | RegExp> | string;

export declare type BettererOptionsIncludes = Array<string> | string;

export declare type BettererOptionsPaths = Array<string> | string;

export declare type BettererOptionsReporters = Array<string | BettererReporter>;

export declare type BettererOptionsRunner = BettererOptionsBase & Partial<{
    ignores: BettererConfigIgnores;
}>;

export declare type BettererOptionsStart = BettererOptionsStartCI | BettererOptionsStartDefault | BettererOptionsStartPrecommit | BettererOptionsStartStrict | BettererOptionsStartUpdate;

export declare type BettererOptionsStartBase = BettererOptionsBase & Partial<{
    excludes: BettererOptionsExcludes;
    includes: BettererOptionsIncludes;
}>;

export declare type BettererOptionsStartCI = BettererOptionsStartBase & Partial<{
    ci: true;
    precommit: false;
    strict: true;
    update: false;
    watch: false;
}>;

export declare type BettererOptionsStartDefault = BettererOptionsStartBase & Partial<{
    ci: false;
    precommit: false;
    strict: false;
    update: false;
    watch: false;
}>;

export declare type BettererOptionsStartPrecommit = BettererOptionsStartBase & Partial<{
    ci: false;
    precommit: true;
    strict: boolean;
    update: false;
    watch: false;
}>;

export declare type BettererOptionsStartStrict = BettererOptionsStartBase & Partial<{
    ci: false;
    precommit: false;
    strict: true;
    update: false;
    watch: false;
}>;

export declare type BettererOptionsStartUpdate = BettererOptionsStartBase & Partial<{
    ci: false;
    precommit: false;
    strict: false;
    update: true;
    watch: false;
}>;

export declare type BettererOptionsWatch = BettererOptionsRunner & Partial<{
    watch: true;
}>;

export declare type BettererPrinter<SerialisedType> = (serialised: SerialisedType) => MaybeAsync<string>;

export declare type BettererProgress<DeserialisedType> = (baseline: DeserialisedType | null, result: DeserialisedType | null) => MaybeAsync<BettererDelta | null>;

export declare type BettererReporter = {
    configError?(config: unknown, error: BettererError): Promise<void> | void;
    contextStart?(context: BettererContext, lifecycle: Promise<BettererContextSummary>): Promise<void> | void;
    contextEnd?(contextSummary: BettererContextSummary): Promise<void> | void;
    contextError?(context: BettererContext, error: BettererError): Promise<void> | void;
    suiteStart?(suite: BettererSuite, lifecycle: Promise<BettererSuiteSummary>): Promise<void> | void;
    suiteEnd?(suiteSummary: BettererSuiteSummary): Promise<void> | void;
    suiteError?(suite: BettererSuite, error: BettererError): Promise<void> | void;
    runStart?(run: BettererRun, lifecycle: Promise<BettererRunSummary>): Promise<void> | void;
    runEnd?(run: BettererRunSummary): Promise<void> | void;
    runError?(run: BettererRun, error: BettererError): Promise<void> | void;
};

export declare type BettererResult = {
    isNew: boolean;
    value: unknown;
};

export declare type BettererRun = {
    readonly baseline: BettererResult | null;
    readonly expected: BettererResult | null;
    readonly filePaths: BettererFilePaths | null;
    readonly name: string;
    readonly isNew: boolean;
    readonly isSkipped: boolean;
};

export declare type BettererRunHandler = (suiteSummary: BettererSuiteSummary) => void;

export declare type BettererRunNames = Array<string>;

export declare type BettererRunner = {
    queue(filePaths?: string | BettererFilePaths, handler?: BettererRunHandler): Promise<void>;
    stop(force: true): Promise<BettererSuiteSummary | null>;
    stop(): Promise<BettererSuiteSummary>;
};

export declare type BettererRuns = ReadonlyArray<BettererRun>;

export declare type BettererRunSummaries = Array<BettererRunSummary>;

export declare type BettererRunSummary = BettererRun & {
    readonly diff: BettererDiff | null;
    readonly delta: BettererDelta | null;
    readonly error: Error | null;
    readonly printed: string | null;
    readonly result: BettererResult | null;
    readonly timestamp: number;
    readonly isBetter: boolean;
    readonly isComplete: boolean;
    readonly isExpired: boolean;
    readonly isFailed: boolean;
    readonly isSame: boolean;
    readonly isUpdated: boolean;
    readonly isWorse: boolean;
};

export declare type BettererSerialise<DeserialisedType, SerialisedType> = (result: DeserialisedType, resultsPath: string) => SerialisedType;

export declare type BettererSerialiser<DeserialisedType, SerialisedType = DeserialisedType> = {
    serialise: BettererSerialise<DeserialisedType, SerialisedType>;
    deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};

export declare type BettererSuite = {
    readonly filePaths: BettererFilePaths;
    readonly runs: BettererRuns;
};

export declare type BettererSuiteSummaries = ReadonlyArray<BettererSuiteSummary>;

export declare type BettererSuiteSummary = BettererSuite & {
    readonly runs: BettererRunSummaries;
    readonly result: string;
    readonly expected: string | null;
    readonly unexpectedDiff: boolean;
    readonly better: BettererRunSummaries;
    readonly completed: BettererRunSummaries;
    readonly expired: BettererRunSummaries;
    readonly failed: BettererRunSummaries;
    readonly new: BettererRunSummaries;
    readonly ran: BettererRunSummaries;
    readonly same: BettererRunSummaries;
    readonly skipped: BettererRunSummaries;
    readonly updated: BettererRunSummaries;
    readonly worse: BettererRunSummaries;
};

export declare class BettererTest<DeserialisedType, SerialisedType = DeserialisedType, DiffType = null> implements BettererTestBase<DeserialisedType, SerialisedType, DiffType> {
    readonly config: BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
    get isOnly(): boolean;
    get isSkipped(): boolean;
    constructor(options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>);
    constraint(constraintOverride: BettererTestConstraint<DeserialisedType>): this;
    goal(goalOverride: BettererTestGoal<DeserialisedType>): this;
    only(): this;
    skip(): this;
}

export declare type BettererTestConfig<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> = {
    configPath: string;
    constraint: BettererTestConstraint<DeserialisedType>;
    deadline: number;
    goal: BettererTestGoal<DeserialisedType>;
    test: BettererTestFunction<DeserialisedType>;
    differ: BettererDiffer<DeserialisedType, DiffType>;
    printer: BettererPrinter<SerialisedType>;
    progress: BettererProgress<DeserialisedType>;
    serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
};

export declare type BettererTestConstraint<DeserialisedType> = (result: DeserialisedType, expected: DeserialisedType) => MaybeAsync<BettererConstraintResult>;

export declare type BettererTestFunction<DeserialisedType> = (run: BettererRun, context: BettererContext) => MaybeAsync<DeserialisedType>;

export declare type BettererTestGoal<DeserialisedType> = (result: DeserialisedType) => MaybeAsync<boolean>;

export declare type BettererTestOptions<DeserialisedType = unknown, SerialisedType = DeserialisedType, DiffType = null> = BettererTestOptionsBasic | BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType>;

export declare type BettererTestOptionsBasic = {
    constraint: BettererTestConstraint<number>;
    test: BettererTestFunction<number>;
    goal?: number | BettererTestGoal<number>;
    deadline?: Date | string;
};

export declare type BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType> = {
    constraint: BettererTestConstraint<DeserialisedType>;
    test: BettererTestFunction<DeserialisedType>;
    differ: BettererDiffer<DeserialisedType, DiffType>;
    printer?: BettererPrinter<SerialisedType>;
    progress?: BettererProgress<DeserialisedType>;
    serialiser: BettererSerialiser<DeserialisedType, SerialisedType>;
    goal: DeserialisedType | BettererTestGoal<DeserialisedType>;
    deadline?: Date | string;
};

export declare function runner(options?: BettererOptionsRunner): Promise<BettererRunner>;

export declare function watch(options?: BettererOptionsWatch): Promise<BettererRunner>;
