import { BettererTestNames, BettererStats } from './types';

export class BettererStatsΩ implements BettererStats {
  public readonly better: BettererTestNames = [];
  public readonly completed: BettererTestNames = [];
  public readonly expired: BettererTestNames = [];
  public readonly failed: BettererTestNames = [];
  public readonly new: BettererTestNames = [];
  public readonly ran: BettererTestNames = [];
  public readonly same: BettererTestNames = [];
  public readonly obsolete: BettererTestNames = [];
  public readonly skipped: BettererTestNames = [];
  public readonly updated: BettererTestNames = [];
  public readonly worse: BettererTestNames = [];
}
