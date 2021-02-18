export declare enum BettererConstraintResult {
    better = "better",
    same = "same",
    worse = "worse"
}

export declare function bigger(result: number, expected: number): BettererConstraintResult;

export declare function smaller(result: number, expected: number): BettererConstraintResult;
