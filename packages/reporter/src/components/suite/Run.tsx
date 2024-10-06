import type { BettererRun } from '@betterer/betterer';
import type { FC } from '@betterer/render';

import { memo, React } from '@betterer/render';
import { BettererTaskLogger } from '@betterer/tasks';

import { useTask } from './tasks.js';
import { useRunReporterState } from './useRunLogger.js';

/** @knipignore used by an exported function */
export interface RunProps {
  run: BettererRun;
}

export const Run: FC<RunProps> = memo(function Run({ run }) {
  const [logs, runLogger, status, runStatusLogger] = useRunReporterState(run);
  const task = useTask(run);

  return (
    <BettererTaskLogger
      name={run.name}
      task={task}
      existingLogger={runLogger}
      existingLogs={logs}
      existingStatus={status}
      existingStatusLogger={runStatusLogger}
    />
  );
});
