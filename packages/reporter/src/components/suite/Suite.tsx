import type { BettererContext, BettererSuite, BettererSuiteSummary } from '@betterer/betterer';
import type { FC } from '@betterer/render';
import type { BettererTasksDone, BettererTasksState } from '@betterer/tasks';

import { React, Box, memo } from '@betterer/render';
import { BettererTaskLogger, BettererTasksLogger } from '@betterer/tasks';

import { useTask } from './tasks.js';
import { SuiteSummary } from './SuiteSummary.js';

export interface SuiteProps {
  context: BettererContext;
  suite: BettererSuite | BettererSuiteSummary;
  suiteSummary?: BettererSuiteSummary;
  done?: BettererTasksDone;
}

export const Suite: FC<SuiteProps> = memo(function Runs({ context, suite, suiteSummary, done }) {
  const { ci, precommit } = context.config;
  return (
    <>
      <Box flexDirection="column" paddingBottom={1}>
        <BettererTasksLogger name="Betterer" update={update} exit={false} done={done} timer={!precommit && !ci}>
          {suite.runs.map((run) => (
            <BettererTaskLogger key={run.name} name={run.name} task={useTask(run)} />
          ))}
        </BettererTasksLogger>
      </Box>
      {suiteSummary ? <SuiteSummary context={context} suiteSummary={suiteSummary} /> : null}
    </>
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
  return `${String(n)} ${n === 1 ? 'test' : 'tests'}`;
}
