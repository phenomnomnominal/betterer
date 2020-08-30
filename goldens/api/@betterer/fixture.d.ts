export declare function createFixtureΔ(fixtureName: string, files: FixtureFileSystemFiles): Promise<Fixture>;

export declare type Fixture = FixtureFileSystem & {
    logs: ReadonlyArray<string>;
    waitForRun(watcher: BettererWatcher): Promise<BettererSummary>;
    runNames(runs: BettererRuns): BettererRunNames;
};

export declare type FixtureFileSystem = {
    paths: Paths;
    deleteFile(filePath: string): Promise<void>;
    readFile(filePath: string): Promise<string>;
    resolve(filePath: string): string;
    writeFile(filePath: string, text: string): Promise<void>;
    cleanup(): Promise<void>;
};

export declare type FixtureFileSystemFiles = Record<string, string>;

export declare type Paths = {
    config: string;
    results: string;
    cwd: string;
};
