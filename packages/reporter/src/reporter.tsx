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
  const RENDER_OPTIONS = {
    debug: process.env.NODE_ENV === 'test'
  };

  let renderer: BettererReporterRenderer;

  return {
    configError(_: BettererConfigPartial, error: BettererError): Promise<void> {
      return renderError(error);
    },
    contextStart(context: BettererContext): void {
      renderer = createRenderer(context);
      renderer.render();
    },
    contextEnd(_: BettererContext, summaries: BettererSummaries): void {
      if (summaries.length > 1) {
        renderer.render({ summaries });
      }
      renderer.stop();
    },
    contextError(_: BettererContext, error: BettererError): Promise<void> {
      return renderError(error);
    },
    runsStart(runs: BettererRuns, filePaths: BettererFilePaths): void {
      renderer.render({ filePaths, runs });
    },
    runsEnd(summary: BettererSummary, filePaths: BettererFilePaths): void {
      renderer.render({ filePaths, runs: summary.runs, summary });
    }
  };

  async function renderError(error: BettererError): Promise<void> {
    const errorApp = render(<Error error={error} />, RENDER_OPTIONS);
    await errorApp.waitUntilExit();
  }

  function createRenderer(context: BettererContext): BettererReporterRenderer {
    let app: Instance;

    return {
      render(data: BettererReporterData = {}): void {
        app?.clear();
        const finalProps = { ...data, context };
        app = render(<Reporter {...finalProps} />, RENDER_OPTIONS);
      },
      stop() {
        app.unmount();
      }
    };
  }
}
