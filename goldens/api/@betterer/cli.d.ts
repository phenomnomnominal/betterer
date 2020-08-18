export declare type BettererPackageJSON = {
    version: string;
    scripts: Record<string, string> & {
        betterer: string;
    };
    devDependencies: Record<string, string>;
};

export declare function cli(argv: CLIArguments): void;

export declare type CLIArguments = ReadonlyArray<string>;

export declare type CLIStartConfig = {
    config: CLIArguments;
    filter: CLIArguments;
    reporter: CLIArguments;
    results: string;
    silent: boolean;
    tsconfig: string;
    update: boolean;
};

export declare type CLIWatchConfig = CLIStartConfig & {
    ignore: CLIArguments;
};

export declare function init(cwd: string, argv: CLIArguments): Promise<void>;

export declare function start(cwd: string, argv: CLIArguments): Promise<BettererStats>;

export declare function watch(cwd: string, argv: CLIArguments): Promise<void>;
