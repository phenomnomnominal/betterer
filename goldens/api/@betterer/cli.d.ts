export declare type BettererCLIArguments = ReadonlyArray<string>;

export declare type BettererCLIStartConfig = {
    config: BettererCLIArguments;
    filter: BettererCLIArguments;
    reporter: BettererCLIArguments;
    results: string;
    silent: boolean;
    tsconfig: string;
    update: boolean;
};

export declare type BettererCLIWatchConfig = BettererCLIStartConfig & {
    ignore: BettererCLIArguments;
};

export declare type BettererPackageJSON = {
    version: string;
    scripts: Record<string, string> & {
        betterer: string;
    };
    devDependencies: Record<string, string>;
};

export declare function ciΔ(cwd: string, argv: BettererCLIArguments): Promise<BettererSummary>;

export declare function cliΔ(argv: BettererCLIArguments): void;

export declare function initΔ(cwd: string, argv: BettererCLIArguments): Promise<void>;

export declare function startΔ(cwd: string, argv: BettererCLIArguments): Promise<BettererSummary>;

export declare function watchΔ(cwd: string, argv: BettererCLIArguments): Promise<void>;
