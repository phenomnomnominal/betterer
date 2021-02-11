import React, { FC, memo } from 'react';

import { BettererRuns } from '@betterer/betterer';
import { BettererTask, BettererTasks, BettererTasksState } from '@betterer/logger';
import { Box } from 'ink';

import { getContexts } from './contexts';

export type RunsProps = {
  runs: BettererRuns;
};

export const Runs: FC<RunsProps> = memo(function Runs({ runs }) {
  const contexts = getContexts(runs);

  return (
    <Box flexDirection="column">
      <BettererTasks name="Betterer" statusMessage={statusMessage} exit={false}>
        {contexts.map((context) => (
          <BettererTask key={context.name} context={context} />
        ))}
      </BettererTasks>
    </Box>
  );
});

function statusMessage(state: BettererTasksState): string {
  const { done, errors, running } = state;
  const runningStatus = running ? `${tests(running)} running... ` : '';
  const doneStatus = done ? `${tests(done)} done! ` : '';
  const errorStatus = errors ? `${tests(errors)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tests(n: number): string {
  return n === 1 ? `${n} test` : `${n} tests`;
}
