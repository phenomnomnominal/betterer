import type { BettererConfig } from '../config/index.js';
import type { BettererSuiteSummariesΩ, BettererSuiteSummaryΩ } from '../suite/index.js';
import type { BettererContextSummary } from './types.js';

export class BettererContextSummaryΩ implements BettererContextSummary {
  constructor(public readonly config: BettererConfig, public readonly suites: BettererSuiteSummariesΩ) {}

  public get lastSuite(): BettererSuiteSummaryΩ {
    return this.suites[this.suites.length - 1];
  }
}
