type BetterTest = () => any | Promise<any>;
type BetterConstraint = (current: any, previous: any) => boolean | Promise<boolean>;

export type BetterTests = {
    [key: string]: [BetterTest, BetterConstraint];
};

export type BetterConfig = {
    configPath: string,
    resultsPath: string,
    filters?: Array<RegExp>
};

type BetterResult = {
    timestamp: number,
    value: string
};

export type BetterResults = Record<string, BetterResult>;

export type BetterStats = {
    obsolete: number,
    ran: number,
    failed: number,
    new: number,
    better: number,
    same: number
    worse: number,
};
