export declare function createFixtureDirectoryΔ(fixturesPath: string): Promise<FixtureFactory>;

export declare type Fixture = FixtureFileSystem & {
    logs: ReadonlyArray<string>;
    waitForRun(watcher: BettererWatcher): Promise<BettererSummary>;
    runNames(runs: BettererRuns): BettererRunNames;
};

export declare type FixtureFactory = (fixtureName: string, files: FixtureFileSystemFiles) => Promise<Fixture>;

export declare type FixtureFileSystem = {
    paths: Paths;
    deleteDirectory(filePath: string): Promise<void>;
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
