export class BettererStats {
  public readonly obsolete: Array<string> = [];
  public readonly skipped: Array<string> = [];
  public readonly ran: Array<string> = [];
  public readonly failed: Array<string> = [];
  public readonly new: Array<string> = [];
  public readonly better: Array<string> = [];
  public readonly same: Array<string> = [];
  public readonly worse: Array<string> = [];
  public readonly completed: Array<string> = [];
}
