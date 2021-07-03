import React from 'react';

import {
  BettererContext,
  BettererFilePaths,
  BettererReporter,
  BettererRuns,
  BettererSummaries,
  BettererSummary
} from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { reset } from '@betterer/tasks';
import { Instance, render } from 'ink';

import { Error, Reporter } from './components';
import { BettererReporterAction, contextEnd, createStore, runsEnd, runsStart } from './state';
import { BettererReporterRenderer } from './types';

export const reporter: BettererReporter = createReporter();

function createReporter(): BettererReporter {
  const RENDER_OPTIONS = {
    debug: process.env.NODE_ENV === 'test'
  };

  let renderer: BettererReporterRenderer;

  return {
    configError(_: unknown, error: BettererError): Promise<void> {
      return renderError(error);
    },
    async contextStart(context: BettererContext): Promise<void> {
      renderer = createRenderer(context);
      await renderer.render();
    },
    async contextEnd(_: BettererContext, suiteSummaries: BettererSummaries): Promise<void> {
      if (suiteSummaries.length > 1) {
        await renderer.render(contextEnd(suiteSummaries));
      }
      renderer.stop();
    },
    contextError(_: BettererContext, error: BettererError): Promise<void> {
      return renderError(error);
    },
    runsStart(runs: BettererRuns, filePaths: BettererFilePaths): Promise<void> {
      reset();
      return renderer.render(runsStart(filePaths, runs));
    },
    runsEnd(summary: BettererSummary): Promise<void> {
      return renderer.render(runsEnd(summary.runs, summary));
    }
  };

  async function renderError(error: BettererError): Promise<void> {
    const errorApp = render(<Error error={error} />, RENDER_OPTIONS);
    await errorApp.waitUntilExit();
  }

  function createRenderer(context: BettererContext): BettererReporterRenderer {
    let app: Instance;

    const dispatch = createStore(context);

    return {
      async render(action?: BettererReporterAction): Promise<void> {
        const state = dispatch(action);
        app?.clear();
        app = render(<Reporter {...state} />, RENDER_OPTIONS);
        await tick();
      },
      stop() {
        app.unmount();
      }
    };
  }
}

function tick(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}
