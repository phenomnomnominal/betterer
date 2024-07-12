import type { BettererConfig } from '../config/index.js';
import type { BettererSuiteSummaries, BettererSuiteSummary } from '../suite/index.js';
import type { BettererContextSummary } from './types.js';

export class BettererContextSummaryΩ implements BettererContextSummary {
  constructor(
    public readonly config: BettererConfig,
    public readonly suites: BettererSuiteSummaries
  ) {}

  public get lastSuite(): BettererSuiteSummary {
    return this.suites[this.suites.length - 1];
  }
}
