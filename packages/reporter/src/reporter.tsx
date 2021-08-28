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
    contextStart(context: BettererContext): void {
      renderer = createRenderer(context);
      renderer.render();
    },
    contextEnd(contextSummary: BettererContextSummary): void {
      renderer.render(contextEnd(contextSummary));
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
    suiteEnd(suiteSummary: BettererSuiteSummary): void {
      renderer.render(suiteEnd(suiteSummary));
    }
  };

  function renderError(error: BettererError): void {
    render(<Error error={error} />, RENDER_OPTIONS);
  }

  function createRenderer(context: BettererContext): BettererReporterRenderer {
    let app: Instance;

    const dispatch = createStore(context);

    return {
      render(action?: BettererReporterAction, done?: () => void): void {
        const state = dispatch(action);
        // eslint-disable-next-line no-console
        console.clear();
        const component = <Reporter {...state} done={done} />;
        if (!app) {
          app = render(component, RENDER_OPTIONS);
        } else {
          app.rerender(component);
        }
      },
      stop() {
        app.unmount();
      }
    };
  }
}
