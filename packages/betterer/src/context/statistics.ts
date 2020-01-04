import { BettererTestNames } from './types';

export class BettererStats {
  public readonly obsolete: BettererTestNames = [];
  public readonly skipped: BettererTestNames = [];
  public readonly ran: BettererTestNames = [];
  public readonly failed: BettererTestNames = [];
  public readonly new: BettererTestNames = [];
  public readonly better: BettererTestNames = [];
  public readonly same: BettererTestNames = [];
  public readonly worse: BettererTestNames = [];
  public readonly completed: BettererTestNames = [];
}
