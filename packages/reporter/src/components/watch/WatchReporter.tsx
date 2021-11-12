import React, { FC, memo } from 'react';

import { BettererReporterState } from '../../state';
import { Suite } from '../suite';
import { WatchEnding } from './WatchEnding';
import { WatchFiles } from './WatchFiles';
import { WatchInstructions } from './WatchInstructions';
import { WatchStarting } from './WatchStarting';
import { useControls } from './useControls';

export const WatchReporter: FC<BettererReporterState> = memo(function WatchReporter(props) {
  const { context, contextSummary, done, suiteSummary } = props;
  const suite = props.suiteSummary || props.suite;

  const editing = useControls(context);

  if (contextSummary) {
    return <WatchEnding />;
  }

  if (suite) {
    return (
      <>
        <WatchFiles context={context} editField={editing} suite={suite} running={!suiteSummary} />
        <Suite context={context} suite={suite} suiteSummary={suiteSummary} done={done} />
        <WatchInstructions />
      </>
    );
  }

  return <WatchStarting context={context} editField={editing} />;
});
