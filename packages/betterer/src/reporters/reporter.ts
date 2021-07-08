import { BettererError } from '@betterer/errors';

import { BettererContext } from '../context';
import { BettererContextSummary } from '../context/types';
import { BettererRun, BettererRunSummary } from '../run';
import { BettererSuite, BettererSuiteSummary } from '../suite';
import { BettererReporter } from './types';

export class BettererReporterΩ implements BettererReporter {
  constructor(private _reporters: Array<BettererReporter>) {}

  async configError(invalidConfig: unknown, error: BettererError): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.configError?.(invalidConfig, error)));
  }

  async contextStart(context: BettererContext, lifecycle: Promise<BettererContextSummary>): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.contextStart?.(context, lifecycle)));
  }

  async contextEnd(contextSummary: BettererContextSummary): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.contextEnd?.(contextSummary)));
  }

  async contextError(context: BettererContext, error: BettererError): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.contextError?.(context, error)));
  }

  async suiteStart(suite: BettererSuite, lifecycle: Promise<BettererSuiteSummary>): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.suiteStart?.(suite, lifecycle)));
  }

  async suiteEnd(suiteSummary: BettererSuiteSummary): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.suiteEnd?.(suiteSummary)));
  }

  async suiteError(suite: BettererSuite, error: BettererError): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.suiteError?.(suite, error)));
  }

  async runStart(run: BettererRun, lifecycle: Promise<BettererRunSummary>): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runStart?.(run, lifecycle)));
  }

  async runEnd(run: BettererRunSummary): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runEnd?.(run)));
  }

  async runError(run: BettererRun, error: BettererError): Promise<void> {
    await Promise.all(this._reporters.map((r) => r.runError?.(run, error)));
  }
}
