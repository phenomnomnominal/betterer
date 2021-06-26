import React, { FC, memo } from 'react';

import { BettererRuns, BettererRunSummaries } from '@betterer/betterer';
import { BettererTaskLogger, BettererTasksLogger, BettererTasksState } from '@betterer/tasks';
import { Box } from 'ink';

import { useTask } from './tasks';

export type RunsProps = {
  runs?: BettererRuns;
  runSummaries?: BettererRunSummaries;
};

export const Runs: FC<RunsProps> = memo(function Runs({ runs = [], runSummaries = [] }) {
  return (
    <Box flexDirection="column" paddingBottom={1}>
      <BettererTasksLogger name="Betterer" update={update} exit={false}>
        {[...runs, ...runSummaries].map((run) => (
          <BettererTaskLogger key={run.name} name={run.name} run={useTask(run)}></BettererTaskLogger>
        ))}
      </BettererTasksLogger>
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
