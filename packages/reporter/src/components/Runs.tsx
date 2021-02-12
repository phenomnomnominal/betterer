import React, { FC, memo } from 'react';

import { BettererTasks, BettererTasksLogger, BettererTasksState } from '@betterer/logger';
import { Box } from 'ink';

export type RunsProps = {
  tasks: BettererTasks;
};

export const Runs: FC<RunsProps> = memo(function Runs({ tasks }) {
  return (
    <Box flexDirection="column">
      <BettererTasksLogger name="Betterer" update={update} tasks={tasks} exit={false} />
    </Box>
  );
});

function update(state: BettererTasksState): string {
  const { done, errors, running } = state;
  const runningStatus = running ? `${tests(running)} running... ` : '';
  const doneStatus = done ? `${tests(done)} done! ` : '';
  const errorStatus = errors ? `${tests(errors)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tests(n: number): string {
  return n === 1 ? `${n} test` : `${n} tests`;
}
