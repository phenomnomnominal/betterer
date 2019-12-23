export type BettererStats = {
  obsolete: Array<string>;
  skipped: Array<string>;
  ran: Array<string>;
  failed: Array<string>;
  new: Array<string>;
  better: Array<string>;
  same: Array<string>;
  worse: Array<string>;
  completed: Array<string>;
};

export function initialise(): BettererStats {
  return {
    obsolete: [],
    skipped: [],
    ran: [],
    failed: [],
    new: [],
    better: [],
    same: [],
    worse: [],
    completed: []
  };
}
