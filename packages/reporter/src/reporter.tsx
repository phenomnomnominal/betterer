import React from 'react';

import {
  BettererContext,
  BettererContextSummary,
  BettererReporter,
  BettererSuite,
  BettererSuiteSummary
} from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { Instance, render, RenderOptions } from 'ink';

import { Error, Reporter } from './components';
import { getRenderOptions } from './render';
import { BettererReporterAction, contextEnd, createStore, suiteEnd, suiteStart } from './state';
import { BettererReporterRenderer } from './types';

/**
 * @public The default {@link @betterer/betterer#BettererReporter | `BettererReporter`}.
 * Supports `betterer` and `betterer watch` modes.
 *
 * @remarks The reporter is implemented as an {@link https://github.com/vadimdemedes/ink | Ink } application
 * to handle all the fancy terminal rerendering. It also means we can do cool stuff like dynamic
 * settings in `betterer watch` mode.
 */
export const reporter: BettererReporter = createReporter();

function createReporter(): BettererReporter {
  const RENDER_OPTIONS: RenderOptions = {
    exitOnCtrlC: false
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
      return new Promise((resolve) => {
        renderer.render(suiteStart(suite), resolve);
      });
    },
    suiteEnd(suiteSummary: BettererSuiteSummary): void {
      renderer.render(suiteEnd(suiteSummary));
    }
  };

  function renderError(error: BettererError): void {
    render(<Error error={error} />, getRenderOptions(RENDER_OPTIONS));
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
          app = render(component, getRenderOptions(RENDER_OPTIONS));
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
