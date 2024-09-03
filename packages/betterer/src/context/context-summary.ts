import { BettererError } from '@betterer/errors';
import type { BettererConfig } from '../config/index.js';
import type { BettererSuiteSummaries, BettererSuiteSummary } from '../suite/index.js';
import type { BettererContextSummary } from './types.js';

export class BettererContextSummaryΩ implements BettererContextSummary {
  constructor(
    public readonly config: BettererConfig,
    public readonly suites: BettererSuiteSummaries
  ) {}

  public get lastSuite(): BettererSuiteSummary {
    const suite = this.suites[this.suites.length - 1];
    if (!suite) {
      throw new BettererError(`Context has not completed a suite run yet! ❌`);
    }
    return suite;
  }
}
