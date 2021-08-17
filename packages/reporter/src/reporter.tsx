import React from 'react';

import { BettererContext, BettererContextSummary, BettererReporter, BettererSuiteSummary } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { reset } from '@betterer/tasks';
import { Instance, render } from 'ink';

import { Error, Reporter } from './components';
import { BettererReporterAction, contextEnd, createStore, suiteEnd, suiteStart } from './state';
import { BettererReporterRenderer } from './types';
import { BettererSuite } from '@betterer/betterer/src/suite';

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
    async contextEnd(contextSummary: BettererContextSummary): Promise<void> {
      if (contextSummary.suites.length > 1) {
        await renderer.render(contextEnd(contextSummary));
      }
      renderer.stop();
    },
    contextError(_: BettererContext, error: BettererError): Promise<void> {
      return renderError(error);
    },
    suiteStart(suite: BettererSuite): Promise<void> {
      reset();
      return renderer.render(suiteStart(suite));
    },
    suiteEnd(suiteSummary: BettererSuiteSummary): Promise<void> {
      return renderer.render(suiteEnd(suiteSummary));
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
