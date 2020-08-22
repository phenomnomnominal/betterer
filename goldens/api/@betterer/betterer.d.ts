export declare function betterer(partialConfig?: BettererConfigPartial): Promise<BettererStats>;
export declare namespace betterer {
    var single: typeof import(".").single;
    var watch: typeof import(".").watch;
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

export declare class BettererContext {
    readonly config: BettererConfig;
    constructor(config: BettererConfig, _reporter?: BettererReporter | undefined);
    getAbsolutePath(filePath: string): string;
    getRelativePath(filePath: string): string;
    process(runs: BettererRuns): Promise<BettererStats>;
    runBetter(run: BettererRun): void;
    runEnd(run: BettererRun): void;
    runFailed(run: BettererRun): void;
    runNew(run: BettererRun): void;
    runRan(run: BettererRun): void;
    runSame(run: BettererRun): void;
    runSkipped(run: BettererRun): void;
    runStart(run: BettererRun): void;
    runUpdate(run: BettererRun): void;
    runWorse(run: BettererRun): void;
    runnerEnd(runs: BettererRuns, files?: BettererFilePaths): void;
    runnerStart(files?: BettererFilePaths): Promise<BettererRuns>;
    setup(): Promise<void>;
    tearDown(): void;
}

export declare type BettererDeserialise<DeserialisedType, SerialisedType = DeserialisedType> = (run: BettererRun, serialised: SerialisedType) => DeserialisedType;

export declare type BettererDiffer = (run: BettererRun) => void;

export declare type BettererExpectedResult = {
    value: string;
};

export declare type BettererExpectedResults = Record<string, BettererExpectedResult>;

export declare class BettererFile {
    readonly absolutePath: string;
    readonly hash: string;
    get issuesDeserialised(): BettererFileIssuesDeserialised;
    get issuesRaw(): BettererFileIssuesRaw;
    readonly key: string;
    readonly relativePath: string;
    constructor(relativePath: string, absolutePath: string, hash: string, issues: BettererFileIssues);
}

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

export declare type BettererFileIssuesDeserialised = ReadonlyArray<BettererFileIssueDeserialised>;

export declare type BettererFileIssueSerialised = [number, number, number, string, string];

export declare type BettererFileIssuesMapDeserialised = Record<string, BettererFileIssuesDeserialised>;

export declare type BettererFileIssuesMapRaw = Record<string, BettererFileIssuesRaw>;

export declare type BettererFileIssuesMapSerialised = Record<string, BettererFileIssuesSerialised>;

export declare type BettererFileIssuesRaw = ReadonlyArray<BettererFileIssueRaw>;

export declare type BettererFileIssuesSerialised = ReadonlyArray<BettererFileIssueSerialised>;

export declare type BettererFilePatterns = ReadonlyArray<RegExp | ReadonlyArray<RegExp>>;

export declare class BettererFileResolver {
    get cwd(): string;
    constructor(depth?: number);
    exclude(...excludePatterns: BettererFilePatterns): this;
    files(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
    forceRelativePaths(message: string): string;
    include(...includePatterns: BettererFileGlobs): this;
    resolve(...pathSegments: Array<string>): string;
    validate(filePaths: BettererFilePaths): Promise<BettererFilePaths>;
}

export declare class BettererFiles {
    readonly files: ReadonlyArray<BettererFile>;
    constructor(files: ReadonlyArray<BettererFile>);
    getFile(absolutePath: string): BettererFile | void;
}

export declare class BettererFileTest extends BettererTest<BettererFiles, BettererFileIssuesMapSerialised> {
    get diff(): BettererFileTestDiff | null;
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

export declare type BettererFileTestOptions = BettererTestOptions<BettererFiles, BettererFileIssuesMapSerialised> & {
    included: ReadonlyArray<string>;
    excluded: ReadonlyArray<RegExp>;
};

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

export declare type BettererReporterModule = {
    reporter: BettererReporter;
};

export declare type BettererReporterNames = ReadonlyArray<string>;

export declare class BettererRun {
    get context(): BettererContext;
    get expected(): unknown | typeof NO_PREVIOUS_RESULT;
    get files(): BettererFilePaths;
    get isBetter(): boolean;
    get isComplete(): boolean;
    get isExpired(): boolean;
    get isFailed(): boolean;
    get isNew(): boolean;
    get isSame(): boolean;
    get isSkipped(): boolean;
    get isUpdated(): boolean;
    get isWorse(): boolean;
    get name(): string;
    get result(): unknown;
    get shouldPrint(): boolean;
    get test(): BettererTest;
    get timestamp(): number;
    get toPrint(): unknown;
    constructor(_context: BettererContext, _test: BettererTest, expected: BettererExpectedResult | typeof NO_PREVIOUS_RESULT, _files: BettererFilePaths);
    better(result: unknown, isComplete: boolean): void;
    diff(): void;
    end(): void;
    failed(): void;
    neww(result: unknown, isComplete: boolean): void;
    ran(): void;
    same(result: unknown): void;
    skipped(): void;
    start(): void;
    update(result: unknown): void;
    worse(result: unknown): void;
}

export declare type BettererRuns = ReadonlyArray<BettererRun>;

export declare type BettererSerialise<DeserialisedType, SerialisedType = DeserialisedType> = (run: BettererRun, result: DeserialisedType) => SerialisedType;

export declare type BettererSerialiser<DeserialisedType, SerialisedType = DeserialisedType> = {
    serialise: BettererSerialise<DeserialisedType, SerialisedType>;
    deserialise: BettererDeserialise<DeserialisedType, SerialisedType>;
};

export declare class BettererStats {
    readonly better: BettererTestNames;
    readonly completed: BettererTestNames;
    readonly expired: BettererTestNames;
    readonly failed: BettererTestNames;
    readonly new: BettererTestNames;
    readonly obsolete: BettererTestNames;
    readonly ran: BettererTestNames;
    readonly same: BettererTestNames;
    readonly skipped: BettererTestNames;
    readonly updated: BettererTestNames;
    readonly worse: BettererTestNames;
}

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

export declare type BettererTestMap = Record<string, BettererTest | BettererTestOptions<unknown, unknown>>;

export declare type BettererTestNames = Array<string>;

export declare type BettererTestOptions<DeserialisedType, SerialisedType = DeserialisedType> = {
    constraint: BettererTestConstraint<DeserialisedType>;
    deadline?: Date | string;
    goal?: DeserialisedType | BettererTestGoal<DeserialisedType>;
    test: BettererTestFunction<DeserialisedType>;
} & BettererTestType<DeserialisedType, SerialisedType> & BettererTestStateOptions;

export declare type BettererTests = ReadonlyArray<BettererTest>;

export declare type BettererTestStateOptions = {
    isOnly?: boolean;
    isSkipped?: boolean;
};

export declare type BettererTestType<DeserialisedType, SerialisedType = DeserialisedType> = {
    differ?: BettererDiffer;
    printer?: BettererPrinter<SerialisedType>;
    serialiser?: BettererSerialiser<DeserialisedType, SerialisedType>;
};

export declare type BettererWatchChangeHandler = (filePaths: BettererFilePaths) => Promise<BettererRuns>;

export declare class BettererWatcher {
    constructor(_context: BettererContext, _onChange: BettererWatchChangeHandler);
    onRun(handler: BettererWatchRunHandler): void;
    setup(): Promise<void>;
    stop(): Promise<void>;
}

export declare type BettererWatchRunHandler = (runs: BettererRuns) => void;

export declare type BettererWatchStop = () => Promise<void>;

export declare function config(partialConfig: BettererConfigPartial): void;

export declare function isBettererTest(test: unknown): test is BettererTest;

export declare const NO_PREVIOUS_RESULT: unique symbol;

export declare type Resolve = Parameters<ConstructorParameters<typeof Promise>[0]>[0];

export declare function single(filePath: string, partialConfig?: BettererConfigPartial): Promise<BettererRuns>;

export declare function watch(partialConfig?: BettererConfigPartial): Promise<BettererWatcher>;
