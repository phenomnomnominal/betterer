export declare function bigger(result: number, expected: number): ConstraintResult;

export declare enum ConstraintResult {
    better = "better",
    same = "same",
    worse = "worse"
}

export declare function smaller(result: number, expected: number): ConstraintResult;
