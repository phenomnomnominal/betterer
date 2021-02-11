import React from 'react';

import {
  BettererConfigPartial,
  BettererContext,
  BettererFilePaths,
  BettererReporter,
  BettererRuns,
  BettererSummaries,
  BettererSummary
} from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { Instance, render } from 'ink';

import { Error, Reporter } from './components';
import { BettererReporterData, BettererReporterRenderer } from './types';

export const reporter: BettererReporter = createReporter();

function createReporter(): BettererReporter {
  let renderer: BettererReporterRenderer;

  return {
    configError(_: BettererConfigPartial, error: BettererError): Promise<void> {
      return renderError(error);
    },
    contextStart(context: BettererContext): void {
      renderer = createRenderer(context);
      renderer();
    },
    async contextEnd(context: BettererContext, summaries: BettererSummaries): Promise<void> {
      if (summaries.length > 1) {
        const app = createRenderer(context)({ summaries });
        app.unmount();
        await app.waitUntilExit();
      }
    },
    contextError(_: BettererContext, error: BettererError): Promise<void> {
      return renderError(error);
    },
    runsStart(runs: BettererRuns, filePaths: BettererFilePaths): void {
      renderer({ filePaths, runs });
    },
    runsEnd(summary: BettererSummary, filePaths: BettererFilePaths): void {
      renderer({ filePaths, runs: summary.runs, summary });
    }
  };

  async function renderError(error: BettererError): Promise<void> {
    const errorApp = render(<Error error={error} />);
    await errorApp.waitUntilExit();
  }

  function createRenderer(context: BettererContext): BettererReporterRenderer {
    let app: Instance;

    return (data: BettererReporterData = {}): Instance => {
      app?.clear();
      const finalProps = { ...data, context };
      app = render(<Reporter {...finalProps} />, { debug: process.env.NODE_ENV === 'test' });
      return app;
    };
  }
}
