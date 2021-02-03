import React from 'react';

import {
  BettererConfigPartial,
  BettererContext,
  BettererReporter,
  BettererRuns,
  BettererSummary
} from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { Instance, render } from 'ink';

import { Reporter } from './components';

export const defaultReporter: BettererReporter = createReporter();

function createReporter(): BettererReporter {
  let app: Instance;

  return {
    configError(_: BettererConfigPartial, error: BettererError): Promise<void> {
      return renderError(error);
    },
    contextStart(): void {
      app = restart();
    },
    contextEnd(_: BettererContext, summary: BettererSummary): void {
      app.rerender(<Reporter runs={summary.runs} summary={summary} />);
    },
    contextError(_: BettererContext, error: BettererError): Promise<void> {
      return renderError(error);
    },
    runsStart(runs: BettererRuns): void {
      app.rerender(<Reporter runs={runs} />);
    }
  };

  async function renderError(error: BettererError): Promise<void> {
    const errorApp = render(<Reporter error={error} />);
    await errorApp.waitUntilExit();
  }

  function restart() {
    app?.clear();
    return render(<Reporter />, { debug: process.env.NODE_ENV === 'test' });
  }
}
