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
    configError(_: unknown, error: BettererError): void {
      renderError(error);
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
    contextError(_: BettererContext, error: BettererError): void {
      renderError(error);
    },
    suiteStart(suite: BettererSuite): Promise<void> {
      reset();
      return new Promise((resolve) => {
        void renderer.render(suiteStart(suite), resolve);
      });
    },
    suiteEnd(suiteSummary: BettererSuiteSummary): Promise<void> {
      return renderer.render(suiteEnd(suiteSummary));
    }
  };

  function renderError(error: BettererError): void {
    render(<Error error={error} />, RENDER_OPTIONS);
  }

  function createRenderer(context: BettererContext): BettererReporterRenderer {
    let app: Instance;

    const dispatch = createStore(context);

    return {
      async render(action?: BettererReporterAction, done?: () => void): Promise<void> {
        const state = dispatch(action);
        app?.clear();
        app = render(<Reporter {...state} done={done} />, RENDER_OPTIONS);
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
