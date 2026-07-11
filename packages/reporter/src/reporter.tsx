import type {
  BettererContext,
  BettererContextSummary,
  BettererReporter,
  BettererRun,
  BettererRunLogger,
  BettererRunSummary,
  BettererSuite,
  BettererSuiteSummary
} from '@betterer/betterer';
import type { BettererLog, BettererLoggerCodeInfo, BettererLoggerMessage, BettererLogs } from '@betterer/logger';
import type { FC, Instance } from '@betterer/render';

import type { BettererReporterAction, BettererReporterState } from './state/index.js';

import type { BettererError } from '@betterer/errors';
import { diffΔ } from '@betterer/logger';
import { React, getRenderOptionsΔ, render } from '@betterer/render';

import { Error, Reporter } from './components/index.js';
import { getDelta } from './deltas/index.js';
import {
  testBetter,
  testComplete,
  testExpired,
  testNew,
  testObsolete,
  testRemoved,
  testRunning,
  testSame,
  testSkipped,
  testUpdated,
  testWorse
} from './messages.js';
import {
  BettererReporterContext,
  contextEnd,
  runEnd,
  runError,
  runStart,
  suiteEnd,
  suiteError,
  suiteStart,
  useStore
} from './state/index.js';
import { getPreciseTimeΔ } from '@betterer/time';

const DIFF_OPTIONS = {
  aAnnotation: 'Expected',
  bAnnotation: 'Result'
};

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

  let logs: Record<string, BettererLogs> = {};
  let status: Record<string, BettererLog> = {};

  const appendLog = (name: string, message: BettererLog): void => {
    const runLogs = logs[name] ?? [];
    runLogs.push(message);
    logs[name] = runLogs;
  };

  const logger = createLogger<string>((name, message) => {
    appendLog(name, message);
  });
  const statusLogger = createLogger<string>((name, message) => {
    status[name] = message;
  });

  const runLogger: BettererRunLogger = createLogger<BettererRun>((run, message) => {
    appendLog(run.name, message);
  });

  const ReporterRoot: FC<BettererReporterState> = (props) => {
    const store = useStore(props);
    const [state] = store;
    [, dispatch] = store;

    return (
      <BettererReporterContext.Provider value={[state, logs, status]}>
        <Reporter />
      </BettererReporterContext.Provider>
    );
  };

  function createLogger<Target>(handler: (target: Target, log: BettererLog) => void) {
    return {
      code(target: Target, code: BettererLoggerCodeInfo): Promise<void> | void {
        handler(target, { code });
      },
      debug(target: Target, debug: BettererLoggerMessage): Promise<void> | void {
        handler(target, { debug });
      },
      error(target: Target, error: BettererLoggerMessage): Promise<void> | void {
        handler(target, { error });
      },
      info(target: Target, info: BettererLoggerMessage): Promise<void> | void {
        handler(target, { info });
      },
      progress(target: Target, progress: BettererLoggerMessage): Promise<void> | void {
        handler(target, { progress });
      },
      success(target: Target, success: BettererLoggerMessage): Promise<void> | void {
        handler(target, { success });
      },
      warn(target: Target, warn: BettererLoggerMessage): Promise<void> | void {
        handler(target, { warn });
      }
    };
  }

  return {
    runLogger,
    configError(_: unknown, error: BettererError): void {
      renderError(error);
    },
    contextStart(context: BettererContext): void {
      const initialState = {
        context,

        done: 0,
        running: 0,
        errors: 0,
        startTime: getPreciseTimeΔ(),
        endTime: null
      };
      app = render(<ReporterRoot {...initialState} />, renderOptions);
    },
    contextEnd(contextSummary: BettererContextSummary): void {
      dispatch(contextEnd(contextSummary));
      app.unmount();
    },
    contextError(context: BettererContext, error: BettererError): void {
      app.unmount();
      renderError(error, context.config.logo);
    },
    suiteStart(suite: BettererSuite): void {
      logs = {};
      status = {};
      dispatch(suiteStart(suite));
    },
    suiteEnd(suiteSummary: BettererSuiteSummary): void {
      dispatch(suiteEnd(suiteSummary));
    },
    suiteError(suite: BettererSuiteSummary, error: BettererError): void {
      dispatch(suiteError(suite, error));
    },
    async runStart(run: BettererRun): Promise<void> {
      await statusLogger.progress(run.name, testRunning(quote(run.name)));
      dispatch(runStart(run));
    },
    async runEnd(runSummary: BettererRunSummary): Promise<void> {
      await logRunSummary(runSummary);
      dispatch(runEnd(runSummary));
    },
    async runError(runSummary: BettererRunSummary, error: BettererError): Promise<void> {
      await statusLogger.error(runSummary.name, error.message);
      dispatch(runError(runSummary, error));
    }
  };

  function renderError(error: BettererError, logo = false): void {
    const app = render(<Error error={error} logo={logo} />, renderOptions);
    app.unmount();
  }

  async function logRunSummary(runSummary: BettererRunSummary): Promise<void> {
    const runName = runSummary.name;
    const name = quote(runName);

    if (runSummary.isExpired) {
      await logger.warn(runName, testExpired(name));
    }

    if (runSummary.isComplete) {
      await statusLogger.success(runName, testComplete(name, runSummary.isSame));
      return;
    }

    const delta = getDelta(runSummary);

    if (runSummary.isBetter) {
      await statusLogger.success(runName, testBetter(name, delta));
      return;
    }
    if (runSummary.isNew) {
      await statusLogger.success(runName, testNew(name, delta));
      return;
    }
    if (runSummary.isObsolete && !runSummary.isRemoved) {
      await statusLogger.success(runName, testObsolete(name));
      return;
    }
    if (runSummary.isRemoved) {
      await statusLogger.success(runName, testRemoved(name));
      return;
    }
    if (runSummary.isSkipped) {
      await statusLogger.success(runName, testSkipped(name, delta));
      return;
    }
    if (runSummary.isSame) {
      await statusLogger.success(runName, testSame(name, delta));
      return;
    }

    const { diff, expected, result } = runSummary;
    if (diff?.diff === null && expected && result) {
      const diffStr = diffΔ(expected.value, result.value, DIFF_OPTIONS);
      if (diffStr) {
        await logger.error(runName, diffStr);
      }
    }

    if (runSummary.isWorse && !runSummary.isUpdated) {
      await statusLogger.error(runName, testWorse(name, delta));
      return;
    }
    if (runSummary.isUpdated) {
      await statusLogger.success(runName, testUpdated(name, delta));
      return;
    }

    // Should never get here. Note that `isFailed` isn't covered here because
    // that will trigger the `runError()` hook.
  }
}

function quote(str: string): string {
  return `"${str.replace(/^"/, '').replace(/"$/, '')}"`;
}
