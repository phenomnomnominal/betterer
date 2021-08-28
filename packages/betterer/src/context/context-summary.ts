import { BettererConfig } from '../config';
import { BettererSuiteSummariesΩ, BettererSuiteSummaryΩ } from '../suite';
import { BettererContextSummary } from './types';

export class BettererContextSummaryΩ implements BettererContextSummary {
  constructor(public readonly config: BettererConfig, public readonly suites: BettererSuiteSummariesΩ) {}

  public get lastSuite(): BettererSuiteSummaryΩ {
    return this.suites[this.suites.length - 1];
  }
}
