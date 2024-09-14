import type {
  BettererContext,
  BettererContextSummary,
  BettererReporter,
  BettererSuite,
  BettererSuiteSummary
} from '@betterer/betterer';
import type { BettererError } from '@betterer/errors';
import type { Instance } from '@betterer/render';
import type { BettererReporterAction } from './state/index.js';
import type { BettererReporterRenderer } from './types.js';

import { React, getRenderOptionsΔ, render } from '@betterer/render';
import { Error, Reporter } from './components/index.js';
import { contextEnd, createStore, suiteEnd, suiteStart } from './state/index.js';

/**
 * @public The default {@link @betterer/betterer#BettererReporter | `BettererReporter`}.
 * Supports `betterer` and `betterer watch` modes.
 *
 * @remarks The reporter is implemented as an {@link https://github.com/vadimdemedes/ink | Ink } application
 * to handle all the fancy terminal rerendering. It also means we can do cool stuff like dynamic
 * settings in `betterer watch` mode.
 */
export const reporter: BettererReporter = createReporterΔ();

/**
 * @internal This could change at any point! Please don't use!
 *
 * Used in {@link @betterer/betterer#BettererReporter | `BettererReporter`} to make
 * sure there is always a fresh default Reporter.
 */
export function createReporterΔ(): BettererReporter {
  const renderOptions = getRenderOptionsΔ(process.env.NODE_ENV, {
    exitOnCtrlC: false
  });

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
    contextError(context: BettererContext, error: BettererError): void {
      renderError(error, context.config.logo);
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

  function renderError(error: BettererError, logo = false): void {
    render(<Error error={error} logo={logo} />, renderOptions);
  }

  function createRenderer(context: BettererContext): BettererReporterRenderer {
    let app: Instance | null = null;

    const dispatch = createStore(context);

    return {
      render(action?: BettererReporterAction, done?: () => void): void {
        const state = dispatch(action);

        const component = <Reporter {...state} done={done} />;
        if (!app) {
          app = render(component, renderOptions);
        } else {
          app.rerender(component);
        }
      },
      stop() {
        if (app) {
          app.unmount();
        }
      }
    };
  }
}
