export declare type BettererResult = {
    value: string;
};

export declare type BettererResults = Record<string, BettererResult>;

export declare function merge(ours: string, theirs: string): BettererResults;

export declare function parse(resultsPath: string): Promise<BettererResults>;

export declare function print(results: BettererResults): string;

export declare function write(toWrite: string, filePath: string): Promise<void>;
