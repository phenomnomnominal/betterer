import { BettererConfig } from '../config';
import { BettererSuiteSummaries, BettererSuiteSummary } from '../suite';
import { BettererContextSummary } from './types';
import { BettererGlobals } from '../types';

export class BettererContextSummaryΩ implements BettererContextSummary {
  public readonly config: BettererConfig;

  constructor(private _globals: BettererGlobals, public readonly suites: BettererSuiteSummaries) {
    this.config = this._globals.config;
  }

  public get lastSuite(): BettererSuiteSummary {
    return this.suites[this.suites.length - 1];
  }
}
