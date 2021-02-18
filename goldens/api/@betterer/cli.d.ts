export declare type BettererCLIArguments = Array<string>;

export declare type BettererCLIBaseConfig = {
    config: BettererCLIArguments;
    filter: BettererCLIArguments;
    reporter: BettererCLIArguments;
    results: string;
    silent: boolean;
    tsconfig: string;
};

export declare type BettererCLICIConfig = BettererCLIEnvConfig & BettererCLIBaseConfig & {
    allowUpdate: false;
    update: false;
};

export declare type BettererCLIEnvConfig = {
    debug: boolean;
    debugLog: string;
};

export declare type BettererCLIInitConfig = BettererCLIEnvConfig & {
    config: string;
};

export declare type BettererCLIStartConfig = BettererCLIEnvConfig & BettererCLIBaseConfig & {
    allowUpdate: boolean;
    update: boolean;
};

export declare type BettererCLIWatchConfig = BettererCLIEnvConfig & BettererCLIBaseConfig & {
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
