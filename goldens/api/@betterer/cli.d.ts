export declare type BettererCLIArguments = Array<string>;

export declare type BettererCLIConfig = BettererCLIEnvConfig & {
    cache: boolean;
    cachePath: string;
    config: BettererCLIArguments;
    exclude: BettererCLIArguments;
    filter: BettererCLIArguments;
    ignore: BettererCLIArguments;
    include: BettererCLIArguments;
    reporter: BettererCLIArguments;
    results: string;
    silent: boolean;
    strict: boolean;
    tsconfig: string;
    update: boolean;
    workers: number | boolean;
};

export declare type BettererCLIEnvConfig = {
    debug: boolean;
    debugLog: string;
};

export declare type BettererCLIInitConfig = BettererCLIEnvConfig & {
    automerge: boolean;
    config: string;
    results: string;
};

export declare type BettererCLIMergeConfig = BettererCLIEnvConfig & {
    results: string;
    contents: Array<string>;
};

export declare type BettererPackageJSON = {
    version: string;
    scripts: Record<string, string> & {
        betterer: string;
    };
    devDependencies: Record<string, string>;
};

export declare function ciΔ(cwd: string, argv: BettererCLIArguments): Promise<BettererSuiteSummary>;

export declare function cliΔ(argv: BettererCLIArguments): void;

export declare function initΔ(cwd: string, argv: BettererCLIArguments): Promise<void>;

export declare function mergeΔ(cwd: string, argv: BettererCLIArguments): Promise<void>;

export declare function precommitΔ(cwd: string, argv: BettererCLIArguments): Promise<BettererSuiteSummary>;

export declare function resultsΔ(cwd: string, argv: BettererCLIArguments): Promise<void>;

export declare function startΔ(cwd: string, argv: BettererCLIArguments, ci?: boolean): Promise<BettererSuiteSummary>;

export declare function watchΔ(cwd: string, argv: BettererCLIArguments): Promise<void>;
