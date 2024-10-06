import type {
  BettererContext,
  BettererContextSummary,
  BettererReporter,
  BettererRun,
  BettererRunLogger,
  BettererSuite,
  BettererSuiteSummary
} from '@betterer/betterer';
import type { BettererError } from '@betterer/errors';
import type { BettererLog, BettererLoggerCodeInfo, BettererLoggerMessage } from '@betterer/logger';
import type { FC, Instance } from '@betterer/render';

import type { BettererReporterAction, BettererReporterState } from './state/index.js';

import { React, getRenderOptionsΔ, render } from '@betterer/render';
import { Error, Reporter } from './components/index.js';
import { contextEnd, useStore, log, status, suiteEnd, suiteStart } from './state/index.js';
import { BettererReporterContext } from './state/store.js';

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

  let app: Instance;
  let dispatch: React.Dispatch<BettererReporterAction>;

  const logger = createLogger((run: BettererRun, message: BettererLog) => {
    dispatch(log(run, message));
  });
  const statusLogger = createLogger((run: BettererRun, message: BettererLog) => {
    dispatch(status(run, message));
  });

  const ReporterRoot: FC<BettererReporterState> = (props) => {
    const store = useStore(props);
    const [state] = store;
    [, dispatch] = store;

    return (
      <BettererReporterContext.Provider value={state}>
        <Reporter />
      </BettererReporterContext.Provider>
    );
  };

  function createLogger(handler: (run: BettererRun, log: BettererLog) => void): BettererRunLogger {
    return {
      code(run: BettererRun, code: BettererLoggerCodeInfo): void {
        handler(run, { code });
      },
      debug(run: BettererRun, debug: BettererLoggerMessage): void {
        handler(run, { debug });
      },
      error(run: BettererRun, error: BettererLoggerMessage): void {
        handler(run, { error });
      },
      info(run: BettererRun, info: BettererLoggerMessage): void {
        handler(run, { info });
      },
      progress(run: BettererRun, progress: BettererLoggerMessage): void {
        handler(run, { progress });
      },
      success(run: BettererRun, success: BettererLoggerMessage): void {
        handler(run, { success });
      },
      warn(run: BettererRun, warn: BettererLoggerMessage): void {
        handler(run, { warn });
      }
    };
  }

  return {
    runLogger: logger,
    configError(_: unknown, error: BettererError): void {
      renderError(error);
    },
    contextStart(context: BettererContext): void {
      const initialState = {
        context,
        done: () => void 0,
        logs: {},
        logger,
        status: {},
        statusLogger
      };
      app = render(<ReporterRoot {...initialState} />, renderOptions);
    },
    contextEnd(contextSummary: BettererContextSummary): void {
      dispatch(contextEnd(contextSummary));
      app.unmount();
    },
    contextError(context: BettererContext, error: BettererError): void {
      renderError(error, context.config.logo);
    },
    suiteStart(suite: BettererSuite): Promise<void> {
      return new Promise((resolve) => {
        dispatch(suiteStart(suite, resolve));
      });
    },
    suiteEnd(suiteSummary: BettererSuiteSummary): void {
      dispatch(suiteEnd(suiteSummary));
    }
  };

  function renderError(error: BettererError, logo = false): void {
    render(<Error error={error} logo={logo} />, renderOptions);
  }
}
