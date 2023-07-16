import type { BettererConfig } from '../config';
import type { BettererSuiteSummariesΩ, BettererSuiteSummaryΩ } from '../suite';
import type { BettererContextSummary } from './types';

export class BettererContextSummaryΩ implements BettererContextSummary {
  constructor(public readonly config: BettererConfig, public readonly suites: BettererSuiteSummariesΩ) {}

  public get lastSuite(): BettererSuiteSummaryΩ {
    return this.suites[this.suites.length - 1];
  }
}
